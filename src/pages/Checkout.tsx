import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '@/hooks/useCart'
import { useToastStore } from '@/hooks/useToast'
import { trpc } from '@/providers/trpc'
import { CreditCard, Banknote, Smartphone, Check, Truck } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function Checkout() {
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const { items, totalPrice, clearCart } = useCart()
  const addToast = useToastStore((s) => s.addToast)
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
      <div className="min-h-screen bg-black pt-[90px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-white font-semibold text-xl mb-2">{t('cart.empty')}</h3>
          <button onClick={() => navigate('/store')} className="px-6 py-3 bg-[#01D7D5] text-black rounded-lg mt-4">
            {t('hero.shop')}
          </button>
        </div>
      </div>
    )
  }

  const createOrderMutation = trpc.order.create.useMutation({
    onSuccess: (data) => {
      if (data.orderNumber) {
        setOrderNumber(data.orderNumber)
      }
      setStep(3)
      clearCart()
      addToast({ title: 'Order Placed!', message: `Your order ${data.orderNumber} has been placed successfully.`, type: 'success' })
    },
    onError: (err) => {
      addToast({ title: 'Error', message: err.message || 'Failed to place order. Please try again.', type: 'error' })
    },
  })

  const handlePlaceOrder = () => {
    const orderNum = `ER-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setOrderNumber(orderNum)

    const shippingAddress = {
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
    }

    createOrderMutation.mutate({
      items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      shippingAddress,
      paymentMethod: paymentMethod === 'baridimob' ? 'baridimob' : paymentMethod === 'card' ? 'card' : 'cod',
      shippingCost,
      discount: 0,
    })
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <h1 className="text-white font-semibold text-3xl mb-8">{t('checkout.title')}</h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          {[
            { n: 1 as const, label: t('checkout.shipping') },
            { n: 2 as const, label: t('checkout.payment') },
            { n: 3 as const, label: lang === 'ar' ? 'تأكيد' : lang === 'fr' ? 'Confirmer' : 'Confirm' },
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
              <h3 className="text-white font-medium text-lg">{t('checkout.shipping')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['fullName', 'phone', 'email', 'postalCode'] as const).map((field) => (
                  <div key={field} className={field === 'email' ? 'sm:col-span-2' : ''}>
                    <label className="text-[#8B949E] text-sm mb-1 block">{field === 'fullName' ? t('checkout.name') : field === 'postalCode' ? (lang === 'ar' ? 'الرمز البريدي' : lang === 'fr' ? 'Code Postal' : 'Postal Code') : field === 'phone' ? t('checkout.phone') : t('checkout.email')}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('checkout.address')}</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[#8B949E] text-sm mb-1 block">{t('checkout.city')}</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none"
                  >
                    <option value="">{t('checkout.city')}</option>
                    <option value="Adrar">Adrar</option>
                    <option value="Chlef">Chlef</option>
                    <option value="Laghouat">Laghouat</option>
                    <option value="Oum El Bouaghi">Oum El Bouaghi</option>
                    <option value="Batna">Batna</option>
                    <option value="Bejaia">Bejaia</option>
                    <option value="Biskra">Biskra</option>
                    <option value="Bechar">Bechar</option>
                    <option value="Blida">Blida</option>
                    <option value="Bouira">Bouira</option>
                    <option value="Tamanrasset">Tamanrasset</option>
                    <option value="Tebessa">Tebessa</option>
                    <option value="Tlemcen">Tlemcen</option>
                    <option value="Tiaret">Tiaret</option>
                    <option value="Tizi Ouzou">Tizi Ouzou</option>
                    <option value="Algiers">Algiers</option>
                    <option value="Djelfa">Djelfa</option>
                    <option value="Jijel">Jijel</option>
                    <option value="Setif">Setif</option>
                    <option value="Saida">Saida</option>
                    <option value="Skikda">Skikda</option>
                    <option value="Sidi Bel Abbes">Sidi Bel Abbes</option>
                    <option value="Annaba">Annaba</option>
                    <option value="Guelma">Guelma</option>
                    <option value="Constantine">Constantine</option>
                    <option value="Medea">Medea</option>
                    <option value="Mostaganem">Mostaganem</option>
                    <option value="MSila">M'Sila</option>
                    <option value="Mascara">Mascara</option>
                    <option value="Ouargla">Ouargla</option>
                    <option value="Oran">Oran</option>
                    <option value="El Bayadh">El Bayadh</option>
                    <option value="Illizi">Illizi</option>
                    <option value="Bordj Bou Arreridj">Bordj Bou Arreridj</option>
                    <option value="Boumerdes">Boumerdes</option>
                    <option value="El Tarf">El Tarf</option>
                    <option value="Tindouf">Tindouf</option>
                    <option value="Tissemsilt">Tissemsilt</option>
                    <option value="El Oued">El Oued</option>
                    <option value="Khenchela">Khenchela</option>
                    <option value="Souk Ahras">Souk Ahras</option>
                    <option value="Tipaza">Tipaza</option>
                    <option value="Mila">Mila</option>
                    <option value="Ain Defla">Ain Defla</option>
                    <option value="Naama">Naama</option>
                    <option value="Ain Temouchent">Ain Temouchent</option>
                    <option value="Ghardaia">Ghardaia</option>
                    <option value="Relizane">Relizane</option>
                    <option value="El Mghair">El Mghair</option>
                    <option value="El Menia">El Menia</option>
                    <option value="Ouled Djellal">Ouled Djellal</option>
                    <option value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</option>
                    <option value="Beni Abbes">Beni Abbes</option>
                    <option value="Timimoun">Timimoun</option>
                    <option value="Touggourt">Touggourt</option>
                    <option value="Djanet">Djanet</option>
                    <option value="In Salah">In Salah</option>
                    <option value="In Guezzam">In Guezzam</option>
                  </select>
                </div>
              </div>

              {/* Shipping Method */}
              <h3 className="text-white font-medium text-lg mt-8">{t('checkout.shipping')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { id: 'standard' as const, label: lang === 'ar' ? 'توصيل عادي' : lang === 'fr' ? 'Livraison Standard' : 'Standard Delivery', price: 2500, time: lang === 'ar' ? '3-5 أيام عمل' : lang === 'fr' ? '3-5 jours ouvrés' : '3-5 business days' },
                  { id: 'express' as const, label: lang === 'ar' ? 'توصيل سريع' : lang === 'fr' ? 'Livraison Express' : 'Express Delivery', price: 5000, time: lang === 'ar' ? '1-2 يوم عمل' : lang === 'fr' ? '1-2 jours ouvrés' : '1-2 business days' },
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
                {t('checkout.order')}
              </button>
            </div>

            {/* Summary */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 h-fit sticky top-24">
              <h3 className="text-white font-medium mb-4">{t('checkout.summary')}</h3>
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
                  <span className="text-[#8B949E]">{t('cart.subtotal')}</span>
                  <span className="text-white">{totalPrice.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B949E]">{t('cart.shipping')}</span>
                  <span className="text-white">{shippingCost.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#30363D]">
                  <span className="text-white">{t('cart.total')}</span>
                  <span className="text-[#01D7D5]">{(totalPrice + shippingCost).toLocaleString()} DZD</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-white font-medium text-lg">{t('checkout.payment')}</h3>
              <div className="space-y-3">
                {([
                  { id: 'card' as const, label: t('checkout.card'), icon: <CreditCard size={20} /> },
                  { id: 'cod' as const, label: t('checkout.cod'), icon: <Banknote size={20} /> },
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
                  {t('login.back').replace('← ', '')}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-4 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all"
                >
                  {t('checkout.order')}
                </button>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 h-fit">
              <h3 className="text-white font-medium mb-4">{t('checkout.summary')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#8B949E]">{t('cart.subtotal')}</span><span className="text-white">{totalPrice.toLocaleString()} DZD</span></div>
                <div className="flex justify-between"><span className="text-[#8B949E]">{t('cart.shipping')}</span><span className="text-white">{shippingCost.toLocaleString()} DZD</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#30363D]"><span className="text-white">{t('cart.total')}</span><span className="text-[#01D7D5]">{(totalPrice + shippingCost).toLocaleString()} DZD</span></div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-[rgba(1,215,213,0.15)] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Check size={40} className="text-[#01D7D5]" />
            </div>
            <h2 className="text-white font-semibold text-3xl mb-2">{t('success')}</h2>
            <p className="text-[#01D7D5] font-semibold text-xl mb-4">{orderNumber}</p>
            <p className="text-[#8B949E] mb-8">{t('contact.reply')}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/track')} className="px-8 py-3 bg-[#01D7D5] text-black font-medium rounded-lg">
                {t('track.title')}
              </button>
              <button onClick={() => navigate('/store')} className="px-8 py-3 border border-[#30363D] text-white rounded-lg hover:border-[#01D7D5] transition-colors">
                {t('cart.continue')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
