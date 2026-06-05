import { Link } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'

export default function Cart() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart()

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#484F58] mb-6">
          <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
          <span>/</span>
          <span className="text-[#8B949E]">Cart</span>
        </div>
        <h1 className="text-white font-semibold text-3xl mb-1">Shopping Cart</h1>
        <p className="text-[#8B949E] text-sm mb-8">{items.length} items</p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={96} className="text-[#30363D] mb-6" />
            <h3 className="text-white font-semibold text-xl mb-2">Your cart is empty</h3>
            <p className="text-[#8B949E] mb-6">Browse our products and find your perfect ride.</p>
            <Link to="/store" className="px-8 py-3 bg-[#01D7D5] text-black font-medium rounded-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-[#161B22] border border-[#30363D] rounded-xl">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{item.name}</p>
                    <p className="text-[#8B949E] text-xs mb-2">Unit price: {item.price.toLocaleString()} DZD</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center border border-[#30363D] rounded text-[#8B949E]">
                        <Minus size={14} />
                      </button>
                      <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center border border-[#30363D] rounded text-[#8B949E]">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{(item.price * item.quantity).toLocaleString()} DZD</p>
                    <button onClick={() => removeItem(item.id)} className="text-[#484F58] hover:text-[#EF4444] transition-colors mt-1">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 sticky top-24">
                <h3 className="text-white font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B949E]">Subtotal</span>
                    <span className="text-white">{totalPrice.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B949E]">Shipping</span>
                    <span className="text-[#8B949E]">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-[#30363D] pt-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-[#01D7D5] font-semibold text-xl">{totalPrice.toLocaleString()} DZD</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg px-3 py-2 focus:border-[#01D7D5] focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-[#30363D] text-white text-sm rounded-lg hover:bg-[#484F58] transition-colors">
                    Apply
                  </button>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full py-4 bg-[#01D7D5] text-black text-center font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
                >
                  Proceed to Checkout
                </Link>
                <Link to="/store" className="block text-center text-[#8B949E] text-sm mt-4 hover:text-[#01D7D5] transition-colors">
                  Continue Shopping
                </Link>

                <div className="mt-4 p-3 bg-[rgba(1,215,213,0.1)] rounded-lg text-center">
                  <p className="text-[#01D7D5] text-xs">You&apos;ll earn {Math.floor(totalPrice / 10)} loyalty points</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
