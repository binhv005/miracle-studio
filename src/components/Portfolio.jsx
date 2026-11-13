import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { categories, portfolio } from '../data/portfolio.js'
import SectionHeading from './SectionHeading.jsx'
import { Photo } from './ui/primitives.jsx'
import { lockScroll } from '../lib/smooth.js'

const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))

export default function Portfolio() {
  const [filter, setFilter] = useState('all')
  const [index, setIndex] = useState(null)

  const items = useMemo(() => (filter === 'all' ? portfolio : portfolio.filter((p) => p.category === filter)), [filter])
  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.id === 'all' ? portfolio.length : portfolio.filter((p) => p.category === c.id).length])),
    [],
  )

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="relative bg-ivory">
      <SectionHeading
        id="portfolio-title"
        title={
          <>
            Mỗi khung hình <em className="text-champagne-dark">là một câu chuyện tình yêu.</em>
          </>
        }
        marquee="Tác phẩm"
        aside={['Ảnh thực tế', 'của Miracle Studio', 'tại Phú Quốc']}
      />

      <div className="container-site pb-16 sm:pb-20 lg:pb-24">
        <div role="tablist" aria-label="Lọc portfolio" className="mb-10 flex flex-wrap gap-2 sm:mb-14">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={`label border px-5 py-3 transition-colors duration-300 ${
                filter === c.id ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {c.label} <sup className="ml-1 text-[9px] tracking-normal opacity-60">{counts[c.id]}</sup>
            </button>
          ))}
        </div>

        <motion.ul
          key={filter}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="columns-2 gap-2 sm:gap-3 lg:columns-3 lg:gap-4"
        >
          {items.map((p, i) => (
            <li key={p.id} className="mb-2 break-inside-avoid sm:mb-3 lg:mb-4">
              <button
                type="button"
                onClick={() => setIndex(i)}
                data-cursor="Xem" className="zoom-frame group block w-full text-left"
                aria-label={`Xem ảnh lớn: ${p.alt}`}
              >
                <Photo
                  image={p}
                  alt={p.alt}
                  fill={false}
                  position={p.position}
                  sizes="(min-width:1024px) 31vw, 50vw"
                />
                <span className="absolute inset-0 flex items-end justify-between bg-charcoal-deep/0 p-4 text-ivory opacity-0 transition-all duration-500 group-hover:bg-charcoal-deep/30 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="label">{catLabel[p.category]}</span>
                  <Plus size={18} strokeWidth={1.25} />
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
      </div>

      <AnimatePresence>
        {index !== null && <Lightbox items={items} index={index} setIndex={setIndex} />}
      </AnimatePresence>
    </section>
  )
}

function Lightbox({ items, index, setIndex }) {
  const closeRef = useRef(null)
  const item = items[index]
  const close = useCallback(() => setIndex(null), [setIndex])
  const go = useCallback((d) => setIndex((i) => (i + d + items.length) % items.length), [items.length, setIndex])

  useEffect(() => {
    const prevFocus = document.activeElement
    closeRef.current?.focus()
    lockScroll(true)
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      prevFocus?.focus?.()
    }
  }, [close, go])

  // Basic swipe support on touch devices.
  const touch = useRef(null)
  const onTouchStart = (e) => (touch.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    touch.current = null
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh toàn màn hình"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] flex flex-col bg-charcoal-deep/[0.97] text-ivory"
      onClick={close}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="container-site flex h-16 shrink-0 items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="label text-ivory/60">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button ref={closeRef} onClick={close} className="flex h-11 w-11 items-center justify-center" aria-label="Đóng">
          <X size={22} strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
        <AnimatePresence mode="wait">
          <motion.img
            key={item.id}
            src={item.src}
            alt={item.alt}
            width={item.w}
            height={item.h}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
        <button
          onClick={(e) => (e.stopPropagation(), go(-1))}
          className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/20 transition-colors hover:bg-ivory hover:text-charcoal sm:flex sm:left-6"
          aria-label="Ảnh trước"
        >
          <ChevronLeft size={20} strokeWidth={1.25} />
        </button>
        <button
          onClick={(e) => (e.stopPropagation(), go(1))}
          className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/20 transition-colors hover:bg-ivory hover:text-charcoal sm:flex sm:right-6"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight size={20} strokeWidth={1.25} />
        </button>
      </div>
      <p className="container-site pb-6 text-center text-sm text-ivory/60" onClick={(e) => e.stopPropagation()}>
        {item.alt}
      </p>
    </motion.div>
  )
}
