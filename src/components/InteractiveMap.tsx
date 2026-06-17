import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Phone, Clock, Navigation, X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

// Need to import leaflet CSS dynamically
let leafletLoaded = false

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

interface InteractiveMapProps {
  dealers: Dealer[]
  selectedDealerId?: number | null
  onDealerSelect?: (id: number) => void
}

export default function InteractiveMap({ dealers, selectedDealerId, onDealerSelect }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<number, any>>({})
  const [activeDealer, setActiveDealer] = useState<Dealer | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const { lang } = useLanguage()

  // Dynamically load Leaflet CSS and JS
  useEffect(() => {
    if (leafletLoaded) return
    leafletLoaded = true

    // Load CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setMapReady(true)
    document.head.appendChild(script)
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current || mapRef.current) return

    const L = (window as any).L
    if (!L) return

    // Create map centered on Algeria
    const map = L.map(mapContainerRef.current, {
      center: [35.0, 2.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    })

    // Add CartoDB Dark Matter tiles (free, dark themed)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">Carto</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [mapReady])

  // Add/update markers when dealers change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    const L = (window as any).L
    if (!L) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((m: any) => {
      if (mapRef.current) mapRef.current.removeLayer(m)
    })
    markersRef.current = {}

    dealers.forEach((dealer) => {
      // Create custom pulse icon
      const pulseHtml = `
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-40" style="width:24px;height:24px;margin:-4px 0 0 -4px;"></div>
          <div class="relative w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50"></div>
        </div>
      `

      const customIcon = L.divIcon({
        html: pulseHtml,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -12],
      })

      const marker = L.marker([dealer.lat, dealer.lng], { icon: customIcon })
        .addTo(mapRef.current)
        .on('click', () => {
          setActiveDealer(dealer)
          if (onDealerSelect) onDealerSelect(dealer.id)
        })

      markersRef.current[dealer.id] = marker
    })

    // Fit bounds to show all dealers
    if (dealers.length > 0) {
      const bounds = dealers.map((d) => [d.lat, d.lng])
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
    }
  }, [dealers, mapReady, onDealerSelect])

  // Fly to selected dealer
  useEffect(() => {
    if (!mapRef.current || !selectedDealerId) return
    const dealer = dealers.find((d) => d.id === selectedDealerId)
    if (dealer) {
      mapRef.current.flyTo([dealer.lat, dealer.lng], 12, { duration: 1.5 })
      setActiveDealer(dealer)
    }
  }, [selectedDealerId, dealers])

  const isAr = lang === 'ar'
  const isFr = lang === 'fr'

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
      <div ref={mapContainerRef} className="absolute inset-0 z-10" />

      {/* Map overlay - corner info */}
      <div className="absolute top-4 left-4 z-[400] bg-[#161B22]/90 backdrop-blur-sm border border-[#30363D] rounded-lg px-3 py-2 pointer-events-none">
        <h3 className="text-white font-medium text-sm flex items-center gap-2">
          <MapPin size={14} className="text-[#01D7D5]" />
          {isAr ? 'شبكة الموزعين' : isFr ? 'Réseau de Concessionnaires' : 'Dealer Network'}
        </h3>
        <p className="text-[#484F58] text-xs">{dealers.length} {isAr ? 'موقع' : isFr ? 'emplacements' : 'locations'}</p>
      </div>

      {/* Active dealer popup card */}
      {activeDealer && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] md:left-auto md:right-4 md:w-[320px]">
          <div className="bg-[#161B22]/95 backdrop-blur-sm border border-[#30363D] rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-white font-medium text-sm">{activeDealer.name}</h4>
                <p className="text-[#8B949E] text-xs flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-[#01D7D5]" />
                  {activeDealer.address}
                </p>
              </div>
              <button
                onClick={() => setActiveDealer(null)}
                className="text-[#484F58] hover:text-white transition-colors p-1"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="text-[#8B949E] flex items-center gap-1">
                <Phone size={10} /> {activeDealer.phone}
              </span>
              <span className="text-[#484F58] flex items-center gap-1">
                <Clock size={10} /> {activeDealer.hours}
              </span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeDealer.lat},${activeDealer.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#01D7D5] text-xs hover:underline"
            >
              <Navigation size={10} />
              {isAr ? 'الاتجاهات' : isFr ? 'Itinéraire' : 'Get Directions'}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
