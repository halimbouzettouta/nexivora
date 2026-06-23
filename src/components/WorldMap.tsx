import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface DealerLocation {
  name: string
  city: string
  lat: number
  lng: number
}

const DEALERS: DealerLocation[] = [
  { name: 'Nexivora Algiers Center', city: 'Algiers', lat: 36.7538, lng: 3.0588 },
  { name: 'Nexivora Oran Showroom', city: 'Oran', lat: 35.6971, lng: -0.6308 },
  { name: 'Nexivora Constantine', city: 'Constantine', lat: 36.3650, lng: 6.6147 },
  { name: 'Nexivora Annaba', city: 'Annaba', lat: 36.9044, lng: 7.7564 },
  { name: 'Nexivora Blida', city: 'Blida', lat: 36.4738, lng: 2.8324 },
  { name: 'Nexivora Setif', city: 'Setif', lat: 36.1911, lng: 5.4137 },
  { name: 'Nexivora Tlemcen', city: 'Tlemcen', lat: 34.8828, lng: -1.3167 },
  { name: 'Nexivora Batna', city: 'Batna', lat: 35.5559, lng: 6.1741 },
]

// World map dot coordinates (simplified continent outlines)
const WORLD_DOTS: { x: number; y: number }[] = []

// Generate dot grid for world map
function generateWorldDots() {
  const dots: { x: number; y: number }[] = []

  // Africa outline (approximate dot positions as percentages)
  const africaRegions = [
    // North Africa / Algeria region
    [28, 18], [29, 17], [30, 17], [31, 17], [32, 17], [33, 17], [34, 18], [35, 19], [36, 20], [37, 21],
    [27, 19], [28, 19], [29, 19], [30, 19], [31, 19], [32, 19], [33, 19], [34, 20], [35, 21], [36, 22],
    [26, 20], [27, 20], [28, 20], [29, 20], [30, 20], [31, 20], [32, 20], [33, 21], [34, 22], [35, 23],
    [26, 21], [27, 21], [28, 21], [29, 21], [30, 21], [31, 21], [32, 22], [33, 23],
    [25, 22], [26, 22], [27, 22], [28, 22], [29, 22], [30, 22], [31, 23], [32, 24],
    [25, 23], [26, 23], [27, 23], [28, 23], [29, 23], [30, 24], [31, 25],
    [24, 24], [25, 24], [26, 24], [27, 24], [28, 24], [29, 25], [30, 26],
    [24, 25], [25, 25], [26, 25], [27, 25], [28, 26], [29, 27],
    // West Africa
    [15, 22], [16, 22], [17, 23], [18, 23], [19, 23], [20, 23],
    [14, 23], [15, 23], [16, 24], [17, 24], [18, 24], [19, 24], [20, 24],
    [13, 24], [14, 24], [15, 25], [16, 25], [17, 25], [18, 25], [19, 26], [20, 26],
    [12, 25], [13, 25], [14, 26], [15, 26], [16, 26], [17, 27], [18, 27],
    // Central Africa
    [22, 26], [23, 26], [24, 26], [25, 26], [26, 26], [27, 26], [28, 27],
    [22, 27], [23, 27], [24, 27], [25, 27], [26, 27], [27, 28],
    [22, 28], [23, 28], [24, 28], [25, 28], [26, 28], [27, 29],
    [23, 29], [24, 29], [25, 29], [26, 29], [27, 30],
    // East Africa
    [30, 27], [31, 27], [32, 27], [33, 27], [34, 27], [35, 28], [36, 28], [37, 28], [38, 29], [39, 29], [40, 30],
    [30, 28], [31, 28], [32, 28], [33, 28], [34, 28], [35, 29], [36, 29], [37, 30], [38, 30], [39, 31],
    // Southern Africa
    [26, 32], [27, 32], [28, 32], [29, 33], [30, 34], [31, 35],
    [26, 33], [27, 33], [28, 34], [29, 35], [30, 36],
    [26, 34], [27, 35], [28, 36], [29, 37],
    // Europe
    [42, 10], [43, 9], [44, 8], [45, 8], [46, 8], [47, 9], [48, 10], [49, 11], [50, 12],
    [42, 11], [43, 10], [44, 9], [45, 9], [46, 9], [47, 10], [48, 11], [49, 12], [50, 13],
    [41, 12], [42, 12], [43, 11], [44, 10], [45, 10], [46, 10], [47, 11], [48, 12], [49, 13],
    [40, 13], [41, 13], [42, 13], [43, 13], [44, 12], [45, 12],
    [38, 14], [39, 14], [40, 14], [41, 14], [42, 14], [43, 13],
    // Asia
    [50, 14], [51, 13], [52, 12], [53, 12], [54, 12], [55, 13], [56, 14], [57, 15], [58, 16], [59, 17], [60, 18],
    [55, 15], [56, 15], [57, 16], [58, 17], [59, 18], [60, 19], [61, 20], [62, 21],
    [60, 20], [61, 21], [62, 22], [63, 23], [64, 24], [65, 25], [66, 26],
    [70, 18], [71, 19], [72, 20], [73, 21], [74, 22], [75, 23], [76, 24],
    // Middle East
    [35, 18], [36, 18], [37, 19], [38, 19], [39, 20], [40, 20], [41, 20], [42, 21], [43, 22], [44, 23],
    [45, 20], [46, 21], [47, 22], [48, 23], [49, 24],
    [50, 22], [51, 23], [52, 24], [53, 25],
    // North America
    [8, 8], [9, 7], [10, 6], [11, 6], [12, 6], [13, 7], [14, 8], [15, 9], [16, 10], [17, 11], [18, 12], [19, 13],
    [5, 10], [6, 9], [7, 8], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 9], [14, 10], [15, 11], [16, 12],
    [4, 12], [5, 11], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10], [11, 10], [12, 11], [13, 12], [14, 13],
    [3, 14], [4, 13], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12], [11, 13], [12, 14],
    [8, 14], [9, 14], [10, 14], [11, 15], [12, 16],
    // South America
    [14, 24], [15, 24], [16, 25], [17, 26], [18, 27], [19, 28], [20, 29],
    [13, 26], [14, 26], [15, 27], [16, 28], [17, 29], [18, 30], [19, 31], [20, 32],
    [14, 28], [15, 29], [16, 30], [17, 31], [18, 32], [19, 33],
    [15, 32], [16, 33], [17, 34], [18, 35],
  ]

  africaRegions.forEach(([x, y]) => {
    dots.push({ x, y })
  })

  return dots
}

const ALL_DOTS = generateWorldDots()

// Continent labels
const CONTINENT_LABELS = [
  { text: 'AFRICA', x: 30, y: 25 },
  { text: 'EUROPE', x: 45, y: 11 },
  { text: 'ASIA', x: 62, y: 18 },
  { text: 'N. AMERICA', x: 10, y: 10 },
  { text: 'S. AMERICA', x: 16, y: 30 },
]

// Convert lat/lng to canvas coordinates (0-100%)
function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

export default function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredDealer, setHoveredDealer] = useState<DealerLocation | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth * 2
        canvas.height = parent.clientHeight * 2
        canvas.style.width = parent.clientWidth + 'px'
        canvas.style.height = parent.clientHeight + 'px'
        ctx.scale(2, 2)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      timeRef.current += 0.015
      const time = timeRef.current
      const w = canvas.width / 2
      const h = canvas.height / 2

      ctx.clearRect(0, 0, w, h)

      // Background glow in center
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4)
      bgGrad.addColorStop(0, 'rgba(1, 215, 213, 0.03)')
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // Draw continent labels first (behind dots)
      ctx.font = `600 10px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      CONTINENT_LABELS.forEach((label) => {
        const lx = (label.x / 80) * w
        const ly = (label.y / 40) * h
        ctx.fillStyle = 'rgba(48, 54, 61, 0.5)'
        ctx.fillText(label.text, lx, ly)
      })

      // Draw dot-matrix world - brighter, bigger dots
      ALL_DOTS.forEach((dot) => {
        const px = (dot.x / 80) * w
        const py = (dot.y / 40) * h
        const distFromCenter = Math.sqrt(Math.pow(px - w / 2, 2) + Math.pow(py - h / 2, 2)) / (w / 2)
        const pulse = Math.sin(time + dot.x * 0.1 + dot.y * 0.1) * 0.3 + 0.7
        const alpha = (0.3 + (1 - distFromCenter) * 0.3) * pulse

        ctx.beginPath()
        ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(1, 215, 213, ${Math.min(alpha, 0.8)})`
        ctx.fill()
      })

      // Draw connection lines between dealers - brighter
      for (let i = 0; i < DEALERS.length; i++) {
        for (let j = i + 1; j < DEALERS.length; j++) {
          const a = latLngToXY(DEALERS[i].lat, DEALERS[i].lng, w, h)
          const b = latLngToXY(DEALERS[j].lat, DEALERS[j].lng, w, h)
          const lineAlpha = 0.08 + Math.sin(time * 0.5 + i + j) * 0.05

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(1, 215, 213, ${lineAlpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // Draw dealer locations - bigger, brighter
      DEALERS.forEach((dealer, i) => {
        const { x, y } = latLngToXY(dealer.lat, dealer.lng, w, h)
        const pulse = Math.sin(time * 2 + i * 0.8) * 0.4 + 0.6
        const radius = 5 + pulse * 2.5

        // Large outer glow ring
        ctx.beginPath()
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(1, 215, 213, ${0.06 * pulse})`
        ctx.fill()

        // Outer ring
        ctx.beginPath()
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(1, 215, 213, ${0.12 * pulse})`
        ctx.fill()

        // Middle ring
        ctx.beginPath()
        ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(1, 215, 213, ${0.25 * pulse})`
        ctx.fill()

        // Core dot - bright cyan
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(1, 215, 213, ${0.7 + pulse * 0.3})`
        ctx.fill()

        // White center
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()

        // City label below pin
        ctx.font = `500 9px Inter, system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = `rgba(139, 148, 158, ${0.6 + pulse * 0.4})`
        ctx.fillText(dealer.city, x, y + radius * 2.5 + 4)
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left)
    const y = (e.clientY - rect.top)
    setMousePos({ x: e.clientX, y: e.clientY })

    const w = canvas.width / 2
    const h = canvas.height / 2

    let closest: DealerLocation | null = null
    let closestDist = Infinity
    DEALERS.forEach((dealer) => {
      const dp = latLngToXY(dealer.lat, dealer.lng, w, h)
      const dist = Math.sqrt(Math.pow(dp.x - x, 2) + Math.pow(dp.y - y, 2))
      if (dist < 20 && dist < closestDist) {
        closest = dealer
        closestDist = dist
      }
    })
    setHoveredDealer(closest)
  }

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredDealer(null)}
        className="absolute inset-0 cursor-crosshair"
      />
      {hoveredDealer && (
        <div
          className="fixed z-50 bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 shadow-xl pointer-events-none"
          style={{ left: mousePos.x + 12, top: mousePos.y - 40 }}
        >
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-[#01D7D5]" />
            <span className="text-white text-xs font-medium">{hoveredDealer.name}</span>
          </div>
          <span className="text-[#484F58] text-[10px]">{hoveredDealer.city}</span>
        </div>
      )}
    </div>
  )
}
