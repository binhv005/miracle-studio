import { useEffect, useRef, useState } from 'react'

/**
 * k95-style cursor: a small dot that trails the pointer (lerp 0.1).
 * Grows over links, and over elements with data-cursor="Label" shows that label.
 * Desktop / fine pointers only; the native cursor stays for accessibility on inputs.
 */
export default function Cursor() {
  const dot = useRef(null)
  const [label, setLabel] = useState('')
  const [mode, setMode] = useState('idle') // idle | link | label | hidden
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty
    let raf
    const loop = () => {
      x += (tx - x) * 0.1
      y += (ty - y) * 0.1
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const classify = (t) => {
      const labelled = t?.closest('[data-cursor]')
      if (t?.closest('input, textarea, select, iframe')) setMode('hidden')
      else if (labelled) {
        setMode('label')
        setLabel(labelled.dataset.cursor)
      } else if (t?.closest('a, button, [role="tab"]')) setMode('link')
      else setMode('idle')
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      classify(e.target instanceof Element ? e.target : null)
    }
    const onScroll = () => classify(document.elementFromPoint(tx, ty))
    const onLeave = () => setMode('hidden')
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  const size = mode === 'label' ? 84 : mode === 'link' ? 36 : 10
  return (
    <div ref={dot} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          mode === 'link' ? 'border border-champagne bg-champagne/10' : 'bg-champagne'
        } ${mode === 'hidden' ? 'opacity-0' : 'opacity-100'}`}
        style={{ width: size, height: size }}
      >
        <span
          className={`label whitespace-nowrap text-[10px] text-charcoal-deep transition-opacity duration-300 ${
            mode === 'label' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
