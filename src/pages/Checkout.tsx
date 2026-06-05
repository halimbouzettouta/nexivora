import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { CreditCard, Banknote, Smartphone, Check, Truck } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'baridimob'>('cod')
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')
  const shippingCost = shippingMethod === 'standard' ? 2500 : 5000

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-black pt-[70px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-white font-semibold text-xl mb-2">Your cart is empty</h3>
          <button onClick={() => navigate('/store')} className="px-6 py-3 bg-[#01D7D5] text-black rounded-lg mt-4">
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = () => {
    const orderNum = `ER-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setOrderNumber(orderNum)
    setStep(3)
    clearCart()
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <h1 className="text-white font-semibold text-3xl mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          {[
            { n: 1 as const, label: 'Shipping' },
            { n: 2 as const, label: 'Payment' },
            { n: 3 as const, label: 'Confirm' },
          ].map((s, idx) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s.n ? 'bg-[#01D7D5] text-black' : 'bg-[#30363D] text-[#484F58]'
              }`}>
                {step > s.n ? <Check size={16} /> : s.n}
              </div>
              <span className={`text-sm ${step >= s.n ? 'text-white' : 'text-[#484F58]'}`}>{s.label}</span>
              {idx < 2 && <div className="w-8 h-px bg-[#30363D] ml-2" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-white font-medium text-lg">Shipping Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['fullName', 'phone', 'email', 'postalCode'] as const).map((field) => (
                  <div key={field} className={field === 'email' ? 'sm:col-span-2' : ''}>
                    <label className="text-[#8B949E] text-sm mb-1 block capitalize">{field === 'fullName' ? 'Full Name' : field === 'postalCode' ? 'Postal Code' : field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-[#8B949E] text-sm mb-1 block">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">City</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none"
                  >
                    <option value="">Select City</option>
                    <option value="Algiers">Algiers</option>
                    <option value="Oran">Oran</option>
                    <option value="Constantine">Constantine</option>
                    <option value="Annaba">Annaba</option>
                    <option value="Setif">Setif</option>
                    <option value="Blida">Blida</option>
                  </select>
                </div>
              </div>

              {/* Shipping Method */}
              <h3 className="text-white font-medium text-lg mt-8">Shipping Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { id: 'standard' as const, label: 'Standard Delivery', price: 2500, time: '3-5 business days' },
                  { id: 'express' as const, label: 'Express Delivery', price: 5000, time: '1-2 business days' },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setShippingMethod(m.id)}
                    className={`p-4 border rounded-xl text-left transition-colors ${
                      shippingMethod === m.id ? 'border-[#01D7D5] bg-[rgba(1,215,213,0.05)]' : 'border-[#30363D]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck size={18} className="text-[#01D7D5]" />
                      <span className="text-white font-medium">{m.label}</span>
                    </div>
                    <p className="text-[#8B949E] text-sm">{m.time}</p>
                    <p className="text-[#01D7D5] font-medium mt-1">{m.price.toLocaleString()} DZD</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
              >
                Continue to Payment
              </button>
            </div>

            {/* Summary */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 h-fit sticky top-24">
              <h3 className="text-white font-medium mb-4">Order Summary</h3>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 mb-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{item.name}</p>
                    <p className="text-[#8B949E] text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white text-sm">{(item.price * item.quantity).toLocaleString()} DZD</p>
                </div>
              ))}
              <div className="border-t border-[#30363D] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B949E]">Subtotal</span>
                  <span className="text-white">{totalPrice.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B949E]">Shipping</span>
                  <span className="text-white">{shippingCost.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#30363D]">
                  <span className="text-white">Total</span>
                  <span className="text-[#01D7D5]">{(totalPrice + shippingCost).toLocaleString()} DZD</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-white font-medium text-lg">Payment Method</h3>
              <div className="space-y-3">
                {([
                  { id: 'card' as const, label: 'Credit/Debit Card', icon: <CreditCard size={20} /> },
                  { id: 'cod' as const, label: 'Cash on Delivery', icon: <Banknote size={20} /> },
                  { id: 'baridimob' as const, label: 'BaridiMob', icon: <Smartphone size={20} /> },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-colors ${
                      paymentMethod === m.id ? 'border-[#01D7D5] bg-[rgba(1,215,213,0.05)]' : 'border-[#30363D]'
                    }`}
                  >
                    <span className="text-[#01D7D5]">{m.icon}</span>
                    <span className="text-white font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-[#30363D] text-white rounded-lg hover:border-[#01D7D5] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
                >
                  Place Order
                </button>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 h-fit">
              <h3 className="text-white font-medium mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#8B949E]">Subtotal</span><span className="text-white">{totalPrice.toLocaleString()} DZD</span></div>
                <div className="flex justify-between"><span className="text-[#8B949E]">Shipping</span><span className="text-white">{shippingCost.toLocaleString()} DZD</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#30363D]"><span className="text-white">Total</span><span className="text-[#01D7D5]">{(totalPrice + shippingCost).toLocaleString()} DZD</span></div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-[rgba(1,215,213,0.15)] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Check size={40} className="text-[#01D7D5]" />
            </div>
            <h2 className="text-white font-semibold text-3xl mb-2">Order Placed Successfully!</h2>
            <p className="text-[#01D7D5] font-semibold text-xl mb-4">{orderNumber}</p>
            <p className="text-[#8B949E] mb-8">Thank you for your purchase. You will receive a confirmation shortly.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/track')} className="px-8 py-3 bg-[#01D7D5] text-black font-medium rounded-lg">
                Track Your Order
              </button>
              <button onClick={() => navigate('/store')} className="px-8 py-3 border border-[#30363D] text-white rounded-lg hover:border-[#01D7D5] transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
