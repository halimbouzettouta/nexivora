import { create } from 'zustand'

interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,

  addItem: (item) => {
    const items = get().items
    const existing = items.find((i) => i.productId === item.productId)
    let newItems: CartItem[]
    if (existing) {
      newItems = items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    } else {
      newItems = [...items, { ...item, id: Date.now() }]
    }
    const totalItems = newItems.reduce((s, i) => s + i.quantity, 0)
    const totalPrice = newItems.reduce((s, i) => s + i.price * i.quantity, 0)
    set({ items: newItems, totalItems, totalPrice, isOpen: true })
  },

  removeItem: (id) => {
    const newItems = get().items.filter((i) => i.id !== id)
    const totalItems = newItems.reduce((s, i) => s + i.quantity, 0)
    const totalPrice = newItems.reduce((s, i) => s + i.price * i.quantity, 0)
    set({ items: newItems, totalItems, totalPrice })
  },

  updateQuantity: (id, quantity) => {
    const newItems = get().items
      .map((i) => (i.id === id ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0)
    const totalItems = newItems.reduce((s, i) => s + i.quantity, 0)
    const totalPrice = newItems.reduce((s, i) => s + i.price * i.quantity, 0)
    set({ items: newItems, totalItems, totalPrice })
  },

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}))
