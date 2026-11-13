import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { img } from '../data/images.js'
import { ImageReveal, Line, Photo, Reveal } from './ui/primitives.jsx'

gsap.registerPlugin(ScrollTrigger)

const NB = ' '
const reasons = [
  { value: '15+', title: 'Năm kinh nghiệm', text: `Hơn 15 năm kinh nghiệm trong lĩnh vực nhiếp${NB}ảnh.`, image: img['why-palm-family'], alt: 'Gia đình đứng dưới cây dừa ngắm hoàng hôn', position: '50% 60%' },
  { value: '1.000+', title: 'Cặp đôi', text: `Đồng hành cùng hơn 1.000 cặp${NB}đôi.`, image: img['why-candid-jump'], alt: 'Chú rể nhảy lên vui nhộn trước cô dâu trên bãi biển', position: '55% 60%' },
  { value: '98%', title: 'Đề xuất trên Facebook', text: `Tỷ lệ đề xuất 98% trên Facebook với 566${NB}đánh${NB}giá.`, image: img['pf-family-hug'], alt: 'Gia đình ôm nhau rạng rỡ bên biển', position: '50% 35%' },
  { value: '24/7', title: 'Tư vấn mọi lúc', text: `Luôn sẵn sàng tư vấn và hỗ trợ khách${NB}hàng${NB}24/24.`, image: img['pf-family-smile'], alt: 'Gia đình áo hoa cười tươi', position: '50% 35%' },
]
const ease = [0.16, 1, 0.3, 1]

export default function WhyChooseUs() {
  const query = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
  const [pinMode, setPinMode] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useLayoutEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setPinMode(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <section aria-labelledby="why-title" className="relative bg-charcoal-deep text-ivory">
      {pinMode ? <Pinned /> : <Stacked />}
    </section>
  )
}

/**
 * k95 "Team" section: pinned for ~4 viewport-heights. Each step holds, then the
 * photo strip glides to the next frame while the list highlight moves on.
 */
function Pinned() {
  const pin = useRef(null)
  const strip = useRef(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const n = reasons.length
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pin.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * n * 0.9}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const k = self.progress
          const step = Math.min(Math.floor(k * n), n - 1)
          const local = Math.max(0, Math.min(1, (k - step / n) * n))
          const glide = local > 0.5 ? (local - 0.5) * 2 : 0
          const pos = Math.min(step + gsap.parseEase('power2.inOut')(glide), n - 1)
          if (strip.current) strip.current.style.transform = `translate3d(0, ${-pos * 100}%, 0)`
          setActive(Math.round(pos))
        },
      })
    }, pin)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  const r = reasons[active]
  return (
    <div ref={pin} className="relative h-screen overflow-hidden">
      <div className="container-site grid h-full grid-cols-12 gap-x-8 pb-12 pt-28">
        {/* Left: title + list (k95 names column) */}
        <div className="col-span-4 flex flex-col">
          <h2 id="why-title" data-split="chars" className="title-lg text-ivory">
            Khác biệt nằm ở <em className="text-champagne">từng chi tiết.</em>
          </h2>
          <ol className="mt-auto space-y-2">
            {reasons.map((x, i) => (
              <li
                key={x.title}
                className={`flex items-baseline gap-4 font-display text-2xl transition-colors duration-500 ${i === active ? 'text-ivory' : 'text-ivory/25'}`}
              >
                <span className="label w-6 text-champagne/80">0{i + 1}</span>
                {x.title}
              </li>
            ))}
          </ol>
        </div>

        {/* Centre: photo strip sliding frame by frame */}
        <div className="col-span-4 flex items-center justify-center">
          <div className="relative aspect-[3/4] h-[62vh] max-h-[620px] overflow-hidden bg-ivory/5">
            <div ref={strip} className="absolute inset-0 will-change-transform">
              {reasons.map((x, i) => (
                <div key={x.title} className="absolute inset-x-0 h-full" style={{ top: `${i * 100}%` }}>
                  <Photo image={x.image} alt={x.alt} position={x.position} sizes="30vw" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: active number swapped with a mask slide */}
        <div className="col-span-4 flex flex-col justify-end">
          <div className="overflow-hidden pb-2 pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={r.value}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                exit={{ y: '-105%' }}
                transition={{ duration: 0.7, ease }}
                className={`font-display text-[8rem] leading-[1] tracking-[-0.03em] ${active % 2 ? 'text-outline text-champagne' : 'text-ivory'}`}
              >
                {r.value}
              </motion.p>
            </AnimatePresence>
          </div>
          <Line className="my-6" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease }}
            >
              <h3 className="label text-champagne">{r.title}</h3>
              <p className="mt-3 max-w-xs text-[15px] text-ivory/70">{r.text}</p>
            </motion.div>
          </AnimatePresence>
          <p className="label mt-10 text-ivory/40">
            {String(active + 1).padStart(2, '0')} / {String(reasons.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  )
}

/** Mobile / reduced-motion layout: big numbers stacked with drawn hairlines. */
function Stacked() {
  return (
    <div className="container-site py-16 sm:py-20 lg:py-24">
      <h2 id="why-title" data-split="chars" className="title-lg text-ivory">
        Khác biệt nằm ở <em className="text-champagne">từng chi tiết.</em>
      </h2>
      <ol className="mt-14">
        {reasons.map((r, i) => (
          <li key={r.title} className="py-8">
            <Line className="mb-8" />
            <Reveal className="grid grid-cols-12 items-end gap-x-4 gap-y-3">
              <span
                className={`col-span-12 font-display text-[4.6rem] leading-[0.95] tracking-[-0.03em] sm:col-span-7 sm:text-[7rem] ${
                  i % 2 ? 'text-outline text-champagne' : ''
                }`}
              >
                {r.value}
              </span>
              <div className="col-span-12 sm:col-span-5 sm:pb-3">
                <h3 className="label text-champagne">{r.title}</h3>
                <p className="mt-3 text-[15px] text-ivory/70">{r.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {reasons.map((r) => (
          <ImageReveal key={r.title} image={r.image} alt={r.alt} sizes="50vw" position={r.position} className="aspect-[3/4]" parallax={16} />
        ))}
      </div>
    </div>
  )
}
