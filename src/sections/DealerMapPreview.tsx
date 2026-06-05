import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'

export default function DealerMapPreview() {
  const { data: dealersList } = trpc.dealer.list.useQuery()

  return (
    <section id="dealers" className="w-full bg-black py-20 px-4 sm:px-6 lg:px-[5vw]">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#484F58] uppercase mb-4">
          FIND A DEALER
        </p>
        <h2
          className="text-white font-semibold leading-tight tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
        >
          Authorized Dealers Across Algeria
        </h2>
        <p className="text-[#8B949E] leading-relaxed max-w-[560px] mx-auto mb-10" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          Visit our network of dealers for test rides, purchases, and service.
        </p>

        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[#30363D] mb-8 bg-[#161B22]">
          <div className="w-full h-full relative">
            {/* Simplified visual map with dealer dots */}
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Algeria outline (simplified) */}
              <path
                d="M150,80 L250,60 L400,50 L550,70 L650,100 L700,150 L720,200 L700,280 L650,340 L550,370 L400,380 L300,360 L200,320 L120,250 L100,180 L120,120 Z"
                fill="#161B22"
                stroke="#30363D"
                strokeWidth="2"
              />
              {/* Grid lines */}
              {[100, 200, 300, 400, 500, 600].map((x) => (
                <line key={`v${x}`} x1={x} y1="40" x2={x} y2="380" stroke="#30363D" strokeWidth="0.5" strokeDasharray="4" />
              ))}
              {[80, 160, 240, 320].map((y) => (
                <line key={`h${y}`} x1="80" y1={y} x2="720" y2={y} stroke="#30363D" strokeWidth="0.5" strokeDasharray="4" />
              ))}
              {/* City markers */}
              {dealersList?.map((dealer, idx) => {
                // Approximate positions for Algerian cities
                const positions: Record<string, { x: number; y: number }> = {
                  'Algiers': { x: 420, y: 100 },
                  'Oran': { x: 220, y: 120 },
                  'Constantine': { x: 520, y: 130 },
                  'Annaba': { x: 600, y: 140 },
                  'Setif': { x: 480, y: 115 },
                  'Blida': { x: 400, y: 110 },
                }
                const pos = positions[dealer.city] || { x: 400 + idx * 40, y: 150 + idx * 20 }
                return (
                  <g key={dealer.id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill="#01D7D5"
                      className="animate-pulse"
                    >
                      <animate
                        attributeName="r"
                        values="6;10;6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;0.6;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x={pos.x}
                      y={pos.y + 22}
                      fill="#8B949E"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {dealer.city}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <Link
          to="/dealers"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#01D7D5] text-[#01D7D5] rounded-lg text-sm font-medium hover:bg-[#01D7D5] hover:text-black transition-all duration-300"
        >
          View Full Map
        </Link>
      </div>
    </section>
  )
}
