import { useState } from 'react'
import { Link } from 'react-router'
import { useLanguage } from '@/hooks/useLanguage'
import { Search, Check, Package, Truck, Home, Clock } from 'lucide-react'

const useTimeline = (t: (k: string) => string, lang: string) => {
  const mockOrder = {
    number: 'ER-2025-0042',
    date: lang === 'fr' ? '1 juin 2025' : 'June 1, 2025',
    status: lang === 'ar' ? 'خرج للتوصيل' : lang === 'fr' ? 'En cours de livraison' : 'Out for Delivery',
    estimatedDelivery: lang === 'fr' ? '5 juin 2025' : 'June 5, 2025',
    trackingNumber: 'TRK123456',
  }

  const timeline = [
    { icon: <Check size={16} />, label: t('track.orderPlaced'), time: 'Jun 1, 10:00 AM', desc: t('track.orderReceived'), completed: true },
    { icon: <Check size={16} />, label: t('track.paymentConfirmed'), time: 'Jun 1, 10:05 AM', desc: t('track.paymentVerified'), completed: true },
    { icon: <Package size={16} />, label: t('track.processing'), time: 'Jun 2, 9:00 AM', desc: t('track.orderPrepared'), completed: true },
    { icon: <Truck size={16} />, label: t('track.shipped'), time: 'Jun 3, 2:00 PM', desc: `${t('track.orderOnWay')} ${t('track.tracking')}: ${mockOrder.trackingNumber}`, completed: true },
    { icon: <Home size={16} />, label: t('track.delivered'), time: '', desc: `${t('track.expectedBy')} ${mockOrder.estimatedDelivery}`, completed: false },
  ]

  return { mockOrder, timeline }
}

export default function OrderTracking() {
  const { t, lang } = useLanguage()
  const [orderNum, setOrderNum] = useState('')
  const [searched, setSearched] = useState(false)

  const { mockOrder, timeline } = useTimeline(t, lang)

  const handleTrack = () => {
    if (orderNum.trim()) setSearched(true)
  }

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-[5vw] py-12">
        <div className="flex items-center gap-2 text-sm text-[#484F58] mb-6">
          <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-[#8B949E]">{t('track.title')}</span>
        </div>
        <h1 className="text-white font-semibold text-3xl mb-8">{t('track.title')}</h1>

        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder={t('track.placeholder')}
            className="flex-1 bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none transition-colors"
          />
          <button
            onClick={handleTrack}
            className="px-6 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all flex items-center gap-2"
          >
            <Search size={18} />
            {t('track.trackBtn')}
          </button>
        </div>

        {searched && (
          <div className="space-y-8">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">#{mockOrder.number}</h3>
                  <p className="text-[#8B949E] text-sm">{mockOrder.date}</p>
                </div>
                <span className="bg-[rgba(1,215,213,0.15)] text-[#01D7D5] text-xs px-3 py-1 rounded">
                  {mockOrder.status}
                </span>
                <p className="text-[#8B949E] text-sm flex items-center gap-1">
                  <Clock size={14} />
                  {t('track.estDelivery')}: {mockOrder.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {timeline.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx < timeline.length - 1 && (
                    <div className={`absolute left-4 top-8 w-0.5 h-[calc(100%-16px)] ${
                      step.completed ? 'bg-[#01D7D5]' : 'bg-[#30363D]'
                    }`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    step.completed ? 'bg-[#01D7D5]' : 'bg-[#30363D]'
                  } ${idx === 3 ? 'animate-pulse-glow' : ''}`}>
                    <span className={step.completed ? 'text-black' : 'text-[#484F58]'}>{step.icon}</span>
                  </div>
                  <div className="pb-8">
                    <p className="text-white font-medium text-sm">{step.label}</p>
                    {step.time && <p className="text-[#8B949E] text-xs">{step.time}</p>}
                    <p className="text-[#484F58] text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
