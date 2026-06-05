import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { MapPin, Phone, Clock, Search } from 'lucide-react'

export default function Dealers() {
  const { data: dealersList } = trpc.dealer.list.useQuery()
  const [search, setSearch] = useState('')
  const [selectedDealer, setSelectedDealer] = useState<number | null>(null)

  const filtered = dealersList?.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      {/* Header */}
      <div className="bg-black pt-16 pb-8 px-4 sm:px-6 lg:px-[5vw]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#484F58] mb-4">
            <Link to="/" className="hover:text-[#01D7D5]">Home</Link>
            <span>/</span>
            <span className="text-[#8B949E]">Dealers</span>
          </div>
          <h1 className="text-white font-semibold text-4xl mb-2">Find a Dealer</h1>
          <p className="text-[#8B949E] max-w-[560px]" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
            Visit our authorized dealers across Algeria for test rides, purchases, and service.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Map */}
          <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden relative">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              <rect width="800" height="500" fill="#0A0A0A" />
              <path
                d="M100,50 L220,30 L400,20 L600,45 L720,80 L760,140 L750,220 L700,320 L600,400 L450,450 L280,420 L140,350 L60,240 L50,140 L80,80 Z"
                fill="#161B22"
                stroke="#30363D"
                strokeWidth="1.5"
              />
              {[150, 250, 350, 450, 550, 650].map((x) => (
                <line key={`v${x}`} x1={x} y1="20" x2={x} y2="480" stroke="#30363D" strokeWidth="0.3" strokeDasharray="3" />
              ))}
              {[100, 200, 300, 400].map((y) => (
                <line key={`h${y}`} x1="40" y1={y} x2="760" y2={y} stroke="#30363D" strokeWidth="0.3" strokeDasharray="3" />
              ))}
              {filtered?.map((dealer, idx) => {
                const positions: Record<string, { x: number; y: number }> = {
                  'Algiers': { x: 440, y: 90 },
                  'Oran': { x: 200, y: 110 },
                  'Constantine': { x: 540, y: 120 },
                  'Annaba': { x: 640, y: 130 },
                  'Setif': { x: 490, y: 105 },
                  'Blida': { x: 410, y: 100 },
                }
                const pos = positions[dealer.city] || { x: 400 + idx * 50, y: 200 }
                const isSelected = selectedDealer === dealer.id
                return (
                  <g
                    key={dealer.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedDealer(dealer.id)}
                  >
                    {isSelected && (
                      <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke="#01D7D5" strokeWidth="1" opacity="0.5">
                        <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={pos.x} cy={pos.y} r="8" fill="#01D7D5" />
                    <circle cx={pos.x} cy={pos.y} r="4" fill="#000" />
                    <text x={pos.x} y={pos.y + 24} fill="#8B949E" fontSize="10" textAnchor="middle">
                      {dealer.city}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Dealer List */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#30363D]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by city..."
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-3 py-2.5 focus:border-[#01D7D5] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered?.map((dealer) => (
                <div
                  key={dealer.id}
                  onClick={() => setSelectedDealer(dealer.id)}
                  className={`p-4 border-b border-[#30363D]/50 cursor-pointer transition-colors ${
                    selectedDealer === dealer.id ? 'bg-[rgba(1,215,213,0.1)] border-l-2 border-l-[#01D7D5]' : 'hover:bg-[rgba(255,255,255,0.02)]'
                  }`}
                >
                  <h4 className="text-white font-medium text-sm mb-1">{dealer.name}</h4>
                  <p className="text-[#8B949E] text-xs flex items-center gap-1 mb-1">
                    <MapPin size={12} />
                    {dealer.address}
                  </p>
                  <p className="text-[#01D7D5] text-xs flex items-center gap-1 mb-1">
                    <Phone size={12} />
                    {dealer.phone}
                  </p>
                  <p className="text-[#484F58] text-xs flex items-center gap-1">
                    <Clock size={12} />
                    {dealer.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
