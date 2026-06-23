import { useState } from 'react'
import { Link } from 'react-router'
import { Search, Package, Truck, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { trpc } from '@/providers/trpc'

export default function OrderTracking() {
  const { t, lang } = useLanguage()
  const [orderNumber, setOrderNumber] = useState('')
  const [searched, setSearched] = useState(false)
  const [localOrder, setLocalOrder] = useState<any>(null)

  // Try API first, fallback to localStorage
  const { data: apiOrder, isLoading } = trpc.order.getByNumber.useQuery(
    { orderNumber },
    { enabled: searched && !!orderNumber, staleTime: 30_000 }
  )

  const order = apiOrder || localOrder

  const handleSearch = () => {
    if (orderNumber.trim()) {
      setSearched(true)
      setLocalOrder(null)
      // Search localStorage as fallback for static deployment
      const orders = JSON.parse(localStorage.getItem('nexivora_orders') || '[]')
      const found = orders.find((o: any) => o.orderNumber === orderNumber.trim())
      if (found) setLocalOrder(found)
    }
  }

  const statusSteps = [
    { key: 'pending', label: lang === 'ar' ? 'قيد الانتظار' : lang === 'fr' ? 'En Attente' : 'Pending', icon: <Package size={20} /> },
    { key: 'processing', label: lang === 'ar' ? 'قيد المعالجة' : lang === 'fr' ? 'En Traitement' : 'Processing', icon: <Package size={20} /> },
    { key: 'shipped', label: lang === 'ar' ? 'تم الشحن' : lang === 'fr' ? 'Expédié' : 'Shipped', icon: <Truck size={20} /> },
    { key: 'delivered', label: lang === 'ar' ? 'تم التوصيل' : lang === 'fr' ? 'Livré' : 'Delivered', icon: <CheckCircle size={20} /> },
  ]

  const getStepIndex = (status: string) => {
    const idx = statusSteps.findIndex(s => s.key === status)
    return idx >= 0 ? idx : 0
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-20">
        <div className="text-center mb-12">
          <h1 className="text-white font-semibold text-3xl md:text-4xl mb-4">
            {lang === 'ar' ? 'تتبع الطلب' : lang === 'fr' ? 'Suivi de Commande' : 'Track Your Order'}
          </h1>
          <p className="text-[#8B949E]">{lang === 'ar' ? 'أدخل رقم طلبك لمعرفة حالته' : lang === 'fr' ? 'Entrez votre numéro de commande pour connaître son statut' : 'Enter your order number to check its status'}</p>
        </div>

        <div className="flex gap-3 mb-12">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484F58]" />
            <input
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setSearched(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={lang === 'ar' ? 'رقم الطلب (مثال: NXV-12345)' : lang === 'fr' ? 'N° de commande (ex: NXV-12345)' : 'Order Number (e.g., NXV-12345)'}
              className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-xl pl-11 pr-4 py-4 focus:border-[#01D7D5] focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-[#01D7D5] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(1,215,213,0.4)] transition-all"
          >
            {lang === 'ar' ? 'بحث' : lang === 'fr' ? 'Rechercher' : 'Track'}
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12"><p className="text-[#484F58]">{lang === 'ar' ? 'جار البحث...' : lang === 'fr' ? 'Recherche...' : 'Searching...'}</p></div>
        )}

        {!isLoading && searched && !order && (
          <div className="text-center py-12 bg-[#161B22] border border-[#30363D] rounded-xl">
            <Package size={48} className="text-[#30363D] mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              {lang === 'ar' ? 'لم يتم العثور على الطلب' : lang === 'fr' ? 'Commande non trouvée' : 'Order Not Found'}
            </p>
            <p className="text-[#484F58] text-sm">
              {lang === 'ar' ? 'تحقق من رقم الطلب وحاول مرة أخرى' : lang === 'fr' ? 'Vérifiez le numéro et réessayez' : 'Please check the order number and try again'}
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#484F58] text-xs mb-1">{lang === 'ar' ? 'رقم الطلب' : lang === 'fr' ? 'N° de Commande' : 'Order Number'}</p>
                  <p className="text-white font-mono text-xl">{order.orderNumber}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  order.status === 'delivered' || order.status === 'completed' ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' :
                  order.status === 'shipped' ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]' :
                  order.status === 'pending' ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' :
                  'bg-[rgba(239,68,68,0.15)] text-[#EF4444]'
                }`}>
                  {order.status?.toUpperCase()}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {statusSteps.map((step, i) => {
                  const currentIdx = getStepIndex(order.status || 'pending')
                  const isActive = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                      {i < statusSteps.length - 1 && (
                        <div className={`absolute top-4 left-1/2 w-full h-0.5 ${isActive ? 'bg-[#01D7D5]' : 'bg-[#30363D]'}`} style={{ transform: 'translateX(50%)' }} />
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        isActive ? 'bg-[#01D7D5] text-black' : 'bg-[#30363D] text-[#484F58]'
                      } ${isCurrent ? 'ring-2 ring-[#01D7D5] ring-offset-2 ring-offset-black' : ''}`}>
                        {step.icon}
                      </div>
                      <p className={`text-xs mt-2 ${isActive ? 'text-white' : 'text-[#484F58]'}`}>{step.label}</p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Customer:</span> {order.shippingAddress?.fullName || 'Guest'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Phone:</span> {order.shippingAddress?.phone || '—'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Address:</span> {order.shippingAddress?.address || '—'}, {order.shippingAddress?.city || '—'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Payment:</span> {order.paymentMethod}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Total:</span> <span className="text-[#01D7D5] font-medium">DZD {Number(order.total).toLocaleString()}</span></p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
