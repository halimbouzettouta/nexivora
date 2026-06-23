const ORDERS_KEY = 'nxv-orders'
const COMMISSIONS_KEY = 'nxv-commissions'

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  address: string
  city: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  shippingMethod: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'canceled' | 'refunded'
  createdAt: string
  // Track which marketer earned commission from this order
  marketerReferralCode: string | null
}

export interface Commission {
  id: string
  source: string
  amount: number
  type: 'direct' | 'team' | 'bonus'
  date: string
  status: 'paid' | 'pending'
  // Which marketer earned this commission
  marketerReferralCode: string
}

// ─── ORDERS ───

function getOrdersRaw(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getOrders(): Order[] {
  return getOrdersRaw()
}

export function getOrdersForMarketer(referralCode: string): Order[] {
  return getOrdersRaw().filter(o => o.marketerReferralCode === referralCode)
}

export function saveOrder(order: Order) {
  const orders = getOrdersRaw()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))

  // Create commission for the marketer whose referral link was used
  if (order.marketerReferralCode) {
    addCommission({
      id: `comm-${Date.now()}`,
      source: `Direct Sale - ${order.items.map(i => i.name).join(', ').slice(0, 50)}`,
      amount: Math.round(order.subtotal * 0.05), // 5% commission
      type: 'direct',
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      marketerReferralCode: order.marketerReferralCode,
    })
  }
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const orders = getOrdersRaw()
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx >= 0) {
    orders[idx].status = status
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }
}

export function getOrderStats() {
  const orders = getOrdersRaw()
  const total = orders.length
  const pending = orders.filter(o => o.status === 'pending').length
  const processing = orders.filter(o => o.status === 'processing').length
  const shipped = orders.filter(o => o.status === 'shipped').length
  const delivered = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length
  const canceled = orders.filter(o => o.status === 'canceled' || o.status === 'refunded').length
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  return { total, pending, processing, shipped, delivered, canceled, totalRevenue }
}

// ─── COMMISSIONS ───

function getCommissionsRaw(): Commission[] {
  try {
    const stored = localStorage.getItem(COMMISSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/** Get ALL commissions (for admin) */
export function getCommissions(): Commission[] {
  return getCommissionsRaw()
}

/** Get commissions for a SPECIFIC marketer only */
export function getCommissionsForMarketer(referralCode: string): Commission[] {
  return getCommissionsRaw().filter(c => c.marketerReferralCode === referralCode)
}

export function addCommission(commission: Commission) {
  const commissions = getCommissionsRaw()
  commissions.unshift(commission)
  localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(commissions))
}

/** Get commission stats for a SPECIFIC marketer */
export function getCommissionStatsForMarketer(referralCode: string) {
  const commissions = getCommissionsForMarketer(referralCode)
  const totalEarned = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0)
  const totalPending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)
  const directTotal = commissions.filter(c => c.type === 'direct').reduce((s, c) => s + c.amount, 0)
  const teamTotal = commissions.filter(c => c.type === 'team').reduce((s, c) => s + c.amount, 0)
  const bonusTotal = commissions.filter(c => c.type === 'bonus').reduce((s, c) => s + c.amount, 0)
  return { totalEarned, totalPending, directTotal, teamTotal, bonusTotal, count: commissions.length }
}

/** Get ALL commission stats (for admin) */
export function getCommissionStats() {
  const commissions = getCommissionsRaw()
  const totalEarned = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0)
  const totalPending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0)
  const directTotal = commissions.filter(c => c.type === 'direct').reduce((s, c) => s + c.amount, 0)
  const teamTotal = commissions.filter(c => c.type === 'team').reduce((s, c) => s + c.amount, 0)
  return { totalEarned, totalPending, directTotal, teamTotal, count: commissions.length }
}
