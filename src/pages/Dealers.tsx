import { useState } from 'react'
import { Link } from 'react-router'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { trpc } from '@/providers/trpc'
import InteractiveMap from '@/components/InteractiveMap'

export default function Dealers() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')

  // Fetch dealers from REAL API
  const { data: dealers = [], isLoading } = trpc.dealer.list.useQuery(undefined, { staleTime: 60_000 })

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  const regions = [
    { key: 'all', label: isAr ? 'جميع المناطق' : isFr ? 'Toutes les Régions' : 'All Regions' },
    { key: 'Center', label: isAr ? 'الوسط' : isFr ? 'Centre' : 'Center' },
    { key: 'West', label: isAr ? 'الغرب' : isFr ? 'Ouest' : 'West' },
    { key: 'East', label: isAr ? 'الشرق' : isFr ? 'Est' : 'East' },
  ]

  const filtered = dealers.filter((d: any) => {
    const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.city?.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === 'all' || d.region === regionFilter
    return matchSearch && matchRegion
  })

  return (
    <div className="min-h-screen bg-black pt-[90px]">
      <div className="bg-black text-center pt-32 pb-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-[#484F58] mb-4">
            <Link to="/" className="hover:text-[#01D7D5]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[#8B949E]">{t('nav.dealers')}</span>
          </div>
          <h1 className="text-white font-semibold text-4xl md:text-5xl mb-2">{t('dealers.title')}</h1>
          <p className="text-[#8B949E] max-w-[560px] mx-auto" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>{t('dealers.desc')}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-[5vw] pb-20">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('dealers.search')}
              className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
          </div>
          <div className="flex gap-1">
            {regions.map((r) => (
              <button key={r.key} onClick={() => setRegionFilter(r.key)}
                className={`px-3 py-2 rounded-lg text-xs transition-colors ${regionFilter === r.key ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{r.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {isLoading && <p className="text-[#484F58] text-sm text-center py-8">Loading dealers...</p>}
            {!isLoading && filtered.length === 0 && <p className="text-[#484F58] text-sm text-center py-8">No dealers found.</p>}
            {filtered.map((d: any) => (
              <div key={d.id} className="w-full text-left bg-[#161B22] border border-[#30363D] rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(1,215,213,0.3)]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#01D7D5]" />
                  <h3 className="text-white font-medium text-sm">{d.name}</h3>
                </div>
                <p className="text-[#8B949E] text-xs mt-1 flex items-center gap-1"><MapPin size={12} /> {d.address}, {d.city}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-[#8B949E] flex items-center gap-1"><Phone size={10} /> {d.phone || '—'}</span>
                  <span className="text-[#484F58] flex items-center gap-1"><Clock size={10} /> {d.hours || '—'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden relative min-h-[450px]">
            <InteractiveMap
              dealers={filtered.map((d: any) => ({
                id: d.id,
                name: d.name,
                city: d.city,
                region: d.region || 'Center',
                address: d.address || '',
                phone: d.phone || '',
                hours: d.hours || '',
                lat: parseFloat(d.latitude) || 36.7538,
                lng: parseFloat(d.longitude) || 3.0588,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
