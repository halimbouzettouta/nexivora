// Admin password authentication - standalone from OAuth
//
// HOW TO CHANGE YOUR PASSWORD (EASY WAY):
// 1. Login as admin with your current password
// 2. Go to Settings tab in admin panel
// 3. Fill in "Change Password" form
// 4. Click Save
//
// Default admin password: "Eride2025!"

const DEFAULT_PASSWORD_HASH = '841dc700f7cc7aea003f93a6b3d6c00ed8b199966a57791f3c57ec1cc91dae15' // SHA-256 of "Eride2025!"
const PASSWORD_STORAGE_KEY = 'nxv-admin-pwd-hash'

// Get current password hash (checks localStorage first, falls back to default)
function getPasswordHash(): string {
  return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD_HASH
}

// Save new password hash
function savePasswordHash(hash: string) {
  localStorage.setItem(PASSWORD_STORAGE_KEY, hash)
}

// Generate SHA-256 hash
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Verify admin password
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await sha256(password)
  return hash === getPasswordHash()
}

// Change admin password (returns true on success)
export async function changeAdminPassword(oldPassword: string, newPassword: string): Promise<boolean> {
  // Verify old password first
  const valid = await verifyAdminPassword(oldPassword)
  if (!valid) return false

  // Hash and save new password
  const newHash = await sha256(newPassword)
  savePasswordHash(newHash)
  return true
}

// Store admin session
export function setAdminSession() {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  localStorage.setItem('nxv-admin-token', token)
  localStorage.setItem('nxv-admin-user', JSON.stringify({
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@eride.dz',
    role: 'superadmin',
  }))
  return token
}

// Check if admin session exists
export function getAdminSession() {
  const token = localStorage.getItem('nxv-admin-token')
  const user = localStorage.getItem('nxv-admin-user')
  if (!token || !user) return null
  try {
    return { token, user: JSON.parse(user) }
  } catch {
    return null
  }
}

// Clear admin session
export function clearAdminSession() {
  localStorage.removeItem('nxv-admin-token')
  localStorage.removeItem('nxv-admin-user')
}

// Check if user is admin
export function isAdmin(): boolean {
  const session = getAdminSession()
  return !!session && session.user.role === 'superadmin'
}
