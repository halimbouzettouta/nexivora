import { Link } from 'react-router'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'

export default function CartDrawer() {
  const { t } = useLanguage()
  const { items, isOpen, closeCart, totalPrice, updateQuantity, removeItem } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-[#161B22] border-l border-[#30363D] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#30363D]">
          <h2 className="text-white font-semibold text-lg">
            {t('nav.home') === 'الرئيسية' ? 'سلة التسوق' : 'Shopping Cart'} ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-[#8B949E] hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-[#30363D] mb-4" />
              <p className="text-white font-medium">{t('cart.empty')}</p>
              <p className="text-[#8B949E] text-sm mt-1">{t('nav.home') === 'الرئيسية' ? 'تصفح منتجاتنا واعثر على دراجتك المثالية.' : 'Browse our products and find your perfect ride.'}</p>
              <Link
                to="/store"
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 bg-[#01D7D5] text-black font-medium rounded-lg text-sm"
              >
                {t('hero.shop')}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-black/30 rounded-xl border border-[#30363D]/50"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <button onClick={() => removeItem(item.id)} className="text-[#484F58] hover:text-[#EF4444] transition-colors p-1 ml-2"><Trash2 size={14} /></button>
                  </div>
                  <p className="text-[#01D7D5] font-semibold mt-1">
                    {item.price.toLocaleString()} DZD
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-[#30363D] rounded-md text-[#8B949E] hover:text-white hover:border-[#01D7D5] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-[#30363D] rounded-md text-[#8B949E] hover:text-white hover:border-[#01D7D5] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#30363D] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#8B949E]">{t('cart.subtotal')}</span>
              <span className="text-white font-semibold text-lg">
                {totalPrice.toLocaleString()} DZD
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                to="/cart"
                onClick={closeCart}
                className="flex-1 py-3 text-center border border-[#30363D] text-white rounded-lg text-sm font-medium hover:border-[#01D7D5] transition-colors"
              >
                {t('cart.title')}
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex-1 py-3 text-center bg-[#01D7D5] text-black rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-shadow"
              >
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
