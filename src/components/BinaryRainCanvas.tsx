import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function BinaryRainCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    container.appendChild(renderer.domElement)

    const isMobile = container.clientWidth < 768
    const stripCount = isMobile ? 12 : 20
    const chars = '01'
    const strips: { speed: number; mesh: THREE.Mesh; texture: THREE.CanvasTexture }[] = []

    for (let i = 0; i < stripCount; i++) {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 1024
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, 128, 1024)
      ctx.fillStyle = '#01D7D5'
      ctx.font = '11px monospace'

      const columns = 10
      const digitsPerColumn = 90
      for (let c = 0; c < columns; c++) {
        const x = (c / columns) * 128
        for (let r = 0; r < digitsPerColumn; r++) {
          const y = ((r + 1) / digitsPerColumn) * 1024
          const char = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(char, x, y)
        }
      }

      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      const geometry = new THREE.PlaneGeometry(0.8, 10)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)

      const visibleWidth = Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z * camera.aspect
      const xPos = ((i / (stripCount - 1)) * 2 - 1) * visibleWidth
      mesh.position.set(xPos, 0, 0)

      strips.push({ speed: Math.random() * 1 + 0.5, mesh, texture })
      scene.add(mesh)
    }

    // Mouse plane for raycaster
    const mousePlaneGeo = new THREE.PlaneGeometry(100, 100)
    const mousePlaneMat = new THREE.MeshBasicMaterial({ visible: false })
    const mousePlane = new THREE.Mesh(mousePlaneGeo, mousePlaneMat)
    scene.add(mousePlane)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-10, -10)
    let intersectX = 0

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(mousePlane)
      if (intersects.length > 0) {
        intersectX = intersects[0].point.x
      }
    }

    if (!isMobile) {
      container.addEventListener('mousemove', onMouseMove)
    }

    const clock = new THREE.Clock()
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      for (const strip of strips) {
        strip.texture.offset.y -= 0.001 * strip.speed * delta * 60
        if (strip.texture.offset.y < -1.0) {
          strip.texture.offset.y += 1.0
        }

        if (!isMobile) {
          const distance = Math.abs(strip.mesh.position.x - intersectX)
          const targetOpacity = Math.max(0.2, 1.0 - distance * 0.8)
          const mat = strip.mesh.material as THREE.MeshBasicMaterial
          mat.opacity += (targetOpacity - mat.opacity) * 0.1
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
