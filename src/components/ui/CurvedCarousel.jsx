import { useEffect, useRef, useState } from 'react'
import { getLenis, prefersReducedMotion } from '../../lib/smooth.js'

/**
 * Concave 3D photo ring (inside of a cylinder seen from slightly behind its axis):
 * cards toward the edges come closer, grow and turn toward the centre.
 * Auto-rotates, can be dragged, and speeds up with scroll velocity.
 */
export default function CurvedCarousel({ images, className = '' }) {
  const ring = useRef(null)
  const stage = useRef(null)
  const [dims, setDims] = useState(null)

  // Responsive geometry
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      const mobile = w < 640
      const count = images.length
      const cardW = mobile ? 128 : w < 1024 ? 170 : 210
      const cardH = Math.round(cardW * 1.3)
      const gap = mobile ? 12 : 18
      const radius = (cardW + gap) / (2 * Math.tan(Math.PI / count))
      setDims({ count, cardW, cardH, radius, perspective: mobile ? 520 : 900 })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [images.length])

  useEffect(() => {
    if (!dims) return
    const reduce = prefersReducedMotion()
    let angle = 0
    let velocity = 0
    let dragging = false
    let lastX = 0
    let raf
    const step = 360 / dims.count
    const cards = [...ring.current.children]

    const apply = () => {
      ring.current.style.transform = `translateZ(${dims.radius * 0.72}px) rotateY(${angle}deg)`
      // Hide cards behind the viewer, fade the far sides
      cards.forEach((c, i) => {
        let a = (((i * step + angle) % 360) + 540) % 360 - 180
        const abs = Math.abs(a)
        c.style.opacity = abs > 80 ? 0 : String(Math.min(1, (80 - abs) / 20))
        c.style.visibility = abs > 80 ? 'hidden' : 'visible'
      })
    }

    const loop = () => {
      const lv = Math.min(Math.abs(getLenis()?.velocity || 0), 60)
      if (!dragging) {
        velocity *= 0.94
        angle += (reduce ? 0 : -0.035 - lv * 0.012) + velocity
      }
      apply()
      raf = requestAnimationFrame(loop)
    }

    const el = stage.current
    const down = (e) => {
      dragging = true
      lastX = e.clientX
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      const d = dx * 0.08
      angle += d
      velocity = d
    }
    const up = () => (dragging = false)
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    apply()
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dims])

  return (
    <div
      ref={stage}
      data-cursor="Kéo"
      className={`relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing ${className}`}
      style={{
        perspective: dims ? `${dims.perspective}px` : undefined,
        height: dims ? dims.cardH * 1.55 : 300,
        // soft fade at both sides like the reference
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)',
      }}
      aria-roledescription="carousel"
      aria-label="Ảnh nổi bật của Miracle Studio"
    >
      {dims && (
        <div ref={ring} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
          {images.map((im, i) => (
            <figure
              key={i}
              className="absolute overflow-hidden rounded-[18px] border border-white/25 bg-charcoal-deep shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              style={{
                width: dims.cardW,
                height: dims.cardH,
                left: -dims.cardW / 2,
                top: -dims.cardH / 2,
                transform: `rotateY(${(i * 360) / dims.count}deg) translateZ(${-dims.radius}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src={im.sm}
                alt={im.alt}
                width={im.w}
                height={im.h}
                loading="lazy"
                decoding="async"
                draggable="false"
                className="h-full w-full object-cover"
                style={{ objectPosition: im.position || '50% 50%' }}
              />
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
