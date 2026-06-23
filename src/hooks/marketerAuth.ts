const SESSION_KEY = 'nxv-session'
const ACCOUNTS_KEY = 'nxv-accounts'

export interface MarketerAccount {
  username: string
  passwordHash: string
  name: string
  referralCode: string
  parentReferralCode: string | null  // who referred this person
  rank: string
  earnings: number
  joinedAt: string
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(16) + 'e7d9a2'
}

function getAccounts(): MarketerAccount[] {
  const stored = localStorage.getItem(ACCOUNTS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export function findMarketerByReferralCode(code: string): MarketerAccount | null {
  const accounts = getAccounts()
  return accounts.find(a => a.referralCode === code) || null
}

export function verifyMarketerLogin(username: string, password: string): MarketerAccount | null {
  const accounts = getAccounts()
  const hash = hashPassword(password)
  return accounts.find(a => a.username === username && a.passwordHash === hash) || null
}

export function registerMarketerAccount(
  name: string,
  username: string,
  password: string,
  referrerCode?: string
): { success: boolean; account?: MarketerAccount; error?: string } {
  const accounts = getAccounts()

  // Debug: log existing accounts
  if (accounts.length > 0) {
    const takenNames = accounts.map(a => a.username).join(', ')
    console.log(`[DEBUG] ${accounts.length} accounts exist. Taken usernames: ${takenNames}`)
  }

  const existing = accounts.find(a => a.username === username)
  if (existing) {
    const allNames = accounts.map(a => a.username).join(', ')
    return { success: false, error: `Username "${username}" already exists. Taken: ${allNames}` }
  }

  const newRefCode = `NX${Date.now().toString(36).toUpperCase().slice(0, 6)}`

  const newAccount: MarketerAccount = {
    username,
    passwordHash: hashPassword(password),
    name,
    referralCode: newRefCode,
    parentReferralCode: referrerCode || null,
    rank: 'Starter',
    earnings: 0,
    joinedAt: new Date().toISOString().split('T')[0],
  }

  accounts.push(newAccount)
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))

  return { success: true, account: newAccount, parentReferralCode: referrerCode || undefined }
}

/** Get all direct referrals (level 1) for a given referral code */
export function getDirectReferrals(referralCode: string): MarketerAccount[] {
  const accounts = getAccounts()
  return accounts.filter(a => a.parentReferralCode === referralCode)
}

/** Get full downline (recursive) for a given referral code */
export function getFullDownline(referralCode: string): { account: MarketerAccount; level: number }[] {
  const accounts = getAccounts()
  const result: { account: MarketerAccount; level: number }[] = []
  const visited = new Set<string>()

  function collect(parentCode: string, level: number) {
    for (const account of accounts) {
      if (account.parentReferralCode === parentCode && !visited.has(account.referralCode)) {
        visited.add(account.referralCode)
        result.push({ account, level })
        collect(account.referralCode, level + 1)
      }
    }
  }

  collect(referralCode, 1)
  return result
}

/** Get network stats for a referral code */
export function getNetworkStats(referralCode: string) {
  const direct = getDirectReferrals(referralCode)
  const fullDownline = getFullDownline(referralCode)
  return {
    directCount: direct.length,
    totalTeam: fullDownline.length,
    indirectCount: fullDownline.length - direct.length,
    teamSales: fullDownline.reduce((sum, d) => sum + d.account.earnings, 0),
  }
}

export function setMarketerSession(account: MarketerAccount) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    username: account.username,
    name: account.name,
    referralCode: account.referralCode,
    rank: account.rank,
    earnings: account.earnings,
    loggedInAt: Date.now(),
  }))
}

export function getMarketerSession(): { username: string; name: string; referralCode: string; rank: string; earnings: number } | null {
  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearMarketerSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function isMarketerLoggedIn(): boolean {
  return getMarketerSession() !== null
}

export function getMarketerAccounts(): MarketerAccount[] {
  return getAccounts()
}

/** Delete all accounts (admin use) */
export function resetAllAccounts() {
  localStorage.removeItem(ACCOUNTS_KEY)
}

/** Update a marketer's password */
export function updateMarketerPassword(username: string, newPassword: string): boolean {
  const accounts = getAccounts()
  const idx = accounts.findIndex(a => a.username === username)
  if (idx === -1) return false
  accounts[idx].passwordHash = hashPassword(newPassword)
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  return true
}

// ─── PASSWORD RESET WITH OTP ───

const OTP_KEY = 'nxv-password-reset-otp'
const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

export interface OTPRecord {
  username: string
  otp: string
  createdAt: number
  attempts: number
}

function getOTPs(): OTPRecord[] {
  const stored = localStorage.getItem(OTP_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveOTPs(otps: OTPRecord[]) {
  localStorage.setItem(OTP_KEY, JSON.stringify(otps))
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** Request password reset OTP for a username. Returns the OTP (to "send" via email). */
export function requestPasswordResetOTP(username: string): { success: boolean; otp?: string; error?: string } {
  const accounts = getAccounts()
  const account = accounts.find(a => a.username === username)
  if (!account) {
    return { success: false, error: 'Account not found' }
  }

  const otps = getOTPs().filter(o => Date.now() - o.createdAt < OTP_EXPIRY_MS)
  const filtered = otps.filter(o => o.username !== username)

  const otp = generateOTP()
  filtered.push({
    username,
    otp,
    createdAt: Date.now(),
    attempts: 0,
  })

  saveOTPs(filtered)
  return { success: true, otp }
}

/** Verify OTP for password reset */
export function verifyPasswordResetOTP(username: string, otp: string): { success: boolean; error?: string } {
  const otps = getOTPs().filter(o => Date.now() - o.createdAt < OTP_EXPIRY_MS)

  const record = otps.find(o => o.username === username)
  if (!record) {
    return { success: false, error: 'OTP expired or not found. Please request a new one.' }
  }

  record.attempts += 1
  if (record.attempts > 3) {
    const filtered = otps.filter(o => o.username !== username)
    saveOTPs(filtered)
    return { success: false, error: 'Too many failed attempts. Please request a new OTP.' }
  }

  saveOTPs(otps)

  if (record.otp !== otp) {
    return { success: false, error: `Invalid OTP. ${3 - record.attempts} attempts remaining.` }
  }

  return { success: true }
}

/** Reset password after OTP verification */
export function resetPassword(username: string, newPassword: string): { success: boolean; error?: string } {
  const accounts = getAccounts()
  const idx = accounts.findIndex(a => a.username === username)
  if (idx === -1) {
    return { success: false, error: 'Account not found' }
  }

  accounts[idx].passwordHash = hashPassword(newPassword)
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))

  // Clean up used OTP
  const otps = getOTPs().filter(o => o.username !== username)
  saveOTPs(otps)

  return { success: true }
}
