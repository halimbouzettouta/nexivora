import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'

interface ProductCard3DProps {
  children: ReactNode
  className?: string
}

export default function ProductCard3D({ children, className = '' }: ProductCard3DProps) {
  const isTouch = useRef(false)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const springConfig = { stiffness: 150, damping: 15 }
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), springConfig)
  const glareX = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig)
  const glareY = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleTouchStart = () => {
    isTouch.current = true
  }

  return (
    <motion.div
      className={`${className}`}
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-xl"
      >
        {children}
        {isHovered && (
          <GlareOverlay glareX={glareX} glareY={glareY} />
        )}
      </motion.div>
    </motion.div>
  )
}

function GlareOverlay({
  glareX,
  glareY,
}: {
  glareX: ReturnType<typeof useSpring>
  glareY: ReturnType<typeof useSpring>
}) {
  const gx = useTransform(glareX, (v) => `${v}%`)
  const gy = useTransform(glareY, (v) => `${v}%`)

  return (
    <motion.div
      className="absolute inset-0 rounded-xl pointer-events-none z-10 hidden md:block"
      style={{
        background: useTransform(
          [gx, gy],
          ([latestX, latestY]) =>
            `radial-gradient(circle at ${latestX} ${latestY}, rgba(255,255,255,0.15) 0%, transparent 60%)`
        ),
        opacity: 0.6,
      }}
    />
  )
}
