import { useState, useCallback } from 'react'
import { Link } from 'react-router'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import InteractiveMap from '@/components/InteractiveMap'

interface Dealer {
  id: number
  name: string
  city: string
  region: string
  address: string
  phone: string
  hours: string
  lat: number
  lng: number
}

const MOCK_DEALERS: Dealer[] = [
  { id: 1, name: 'Nexivora Algiers Center', city: 'Algiers', region: 'Center', address: '123 Boulevard Mohamed VI, Algiers', phone: '0234-567-890', hours: 'Sat-Thu 9AM-6PM', lat: 36.7538, lng: 3.0588 },
  { id: 2, name: 'Nexivora Oran Showroom', city: 'Oran', region: 'West', address: '45 Avenue Emir Abdelkader, Oran', phone: '0412-345-678', hours: 'Sat-Thu 9AM-7PM', lat: 35.6971, lng: -0.6308 },
  { id: 3, name: 'Nexivora Constantine', city: 'Constantine', region: 'East', address: '78 Rue Ahmed Bey, Constantine', phone: '0315-678-901', hours: 'Sat-Thu 8:30AM-5:30PM', lat: 36.3650, lng: 6.6147 },
  { id: 4, name: 'Nexivora Annaba', city: 'Annaba', region: 'East', address: '12 Boulevard Colonel Amirouche, Annaba', phone: '0238-901-234', hours: 'Sat-Thu 9AM-6PM', lat: 36.9044, lng: 7.7564 },
  { id: 5, name: 'Nexivora Blida', city: 'Blida', region: 'Center', address: '34 Route de Soumaa, Blida', phone: '0235-456-789', hours: 'Sat-Thu 9AM-6PM', lat: 36.4738, lng: 2.8324 },
  { id: 6, name: 'Nexivora Setif', city: 'Setif', region: 'East', address: '56 Avenue du 1er Novembre, Setif', phone: '0236-789-012', hours: 'Sat-Thu 8:30AM-5:30PM', lat: 36.1911, lng: 5.4137 },
  { id: 7, name: 'Nexivora Tlemcen', city: 'Tlemcen', region: 'West', address: '89 Rue de la Grande Mosque, Tlemcen', phone: '0243-567-890', hours: 'Sat-Thu 9AM-6PM', lat: 34.8828, lng: -1.3167 },
  { id: 8, name: 'Nexivora Batna', city: 'Batna', region: 'East', address: '23 Avenue des Freres Bouadou, Batna', phone: '0233-456-789', hours: 'Sat-Thu 9AM-6PM', lat: 35.5559, lng: 6.1741 },
]

function getRegions(t: (k: string) => string, isAr: boolean, isFr: boolean) {
  return [
    { key: 'all', label: t('dealers.allRegions') },
    { key: 'Center', label: t('dealers.center') },
    { key: 'West', label: t('dealers.west') },
    { key: 'East', label: t('dealers.east') },
  ]
}

export default function Dealers() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [selectedDealerId, setSelectedDealerId] = useState<number | null>(null)

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'
  const regions = getRegions(t, isAr, isFr)

  const filtered = MOCK_DEALERS.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === 'all' || d.region === regionFilter
    return matchSearch && matchRegion
  })

  const handleDealerSelect = useCallback((id: number) => {
    setSelectedDealerId(id)
  }, [])

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
        {/* Search + Filters */}
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

        {/* Map + List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Dealer List - clickable cards */}
          <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => handleDealerSelect(d.id)}
                className={`w-full text-left bg-[#161B22] border rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedDealerId === d.id
                    ? 'border-[#01D7D5] shadow-[0_0_15px_rgba(1,215,213,0.15)]'
                    : 'border-[#30363D] hover:border-[rgba(1,215,213,0.3)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${selectedDealerId === d.id ? 'bg-[#01D7D5]' : 'bg-[#484F58]'}`} />
                  <h3 className="text-white font-medium text-sm">{d.name}</h3>
                </div>
                <p className="text-[#8B949E] text-xs mt-1 flex items-center gap-1"><MapPin size={12} /> {d.address}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-[#8B949E] flex items-center gap-1"><Phone size={10} /> {d.phone}</span>
                  <span className="text-[#484F58] flex items-center gap-1"><Clock size={10} /> {d.hours}</span>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${d.lat},${d.lng}`} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[#01D7D5] text-xs hover:underline"
                  onClick={(e) => e.stopPropagation()}>
                  <Navigation size={12} /> {t('dealers.directions')}
                </a>
              </button>
            ))}
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden relative min-h-[450px]">
            <InteractiveMap
              dealers={filtered}
              selectedDealerId={selectedDealerId}
              onDealerSelect={handleDealerSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
