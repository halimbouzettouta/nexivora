import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ProductCard3DProps {
  children: ReactNode
  className?: string
}

export default function ProductCard3D({ children, className = '' }: ProductCard3DProps) {
  const isTouch = useRef(false)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const springConfig = { stiffness: 150, damping: 15 }
  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), springConfig)
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
  }

  const handleTouchStart = () => {
    isTouch.current = true
  }

  return (
    <motion.div
      className={`perspective-[800px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative rounded-xl"
      >
        {children}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-10 hidden md:block"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
            ),
            opacity: 0.6,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
