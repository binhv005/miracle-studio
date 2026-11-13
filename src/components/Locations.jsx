import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { locations, locationTiles } from '../data/locations.js'
import { Photo, Reveal } from './ui/primitives.jsx'

const NB = ' '

/* ---------- fine-line ornaments ---------- */
function Bow({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 52" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className={className}>
      <path d="M30 18C19 4 4 7 8 18c3 8 15 5 22 0Z" />
      <path d="M30 18C41 4 56 7 52 18c-3 8-15 5-22 0Z" />
      <circle cx="30" cy="18" r="2.6" />
      <path d="M28.5 20.5C25 30 21 39 13 48M31.5 20.5C35 30 39 39 47 48" />
      <path d="M13 48l3-5M47 48l-3-5" />
    </svg>
  )
}
function Bouquet({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" className={className}>
      {[[22, 20], [34, 14], [44, 24], [28, 32], [40, 36]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6.5" />
          <circle cx={x} cy={y} r="3" />
          <path d={`M${x - 6} ${y}q6-4 12 0M${x} ${y - 6}q4 6 0 12`} opacity="0.7" />
        </g>
      ))}
      <path d="M26 40L30 70M34 40l-1 30M40 42L35 70" />
      <path d="M24 58c6 4 12 4 18-1M30 60c-6 4-10 10-12 14M34 60c6 4 9 9 10 14" />
    </svg>
  )
}
function Sprig({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 50 60" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" className={className}>
      <path d="M25 58V22" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M25 ${48 - i * 8}c-8-2-12-7-13-12M25 ${48 - i * 8}c8-2 12-7 13-12`} />
      ))}
      <path d="M25 22c-5-6-5-12 0-18 5 6 5 12 0 18Z" />
    </svg>
  )
}

function Deco({ kind }) {
  const cls = 'pointer-events-none absolute z-10 text-ivory/80'
  if (kind === 'bow-right') return <Bow className={`${cls} -right-[1.6vw] top-[40%] w-[3.6vw] min-w-9`} />
  if (kind === 'bow-top') return <Bow className={`${cls} -left-[1.4vw] -top-[1.6vw] w-[3.4vw] min-w-9 -rotate-12`} />
  if (kind === 'bouquet-top') return <Bouquet className={`${cls} -right-[2vw] -top-[3vw] w-[4.2vw] min-w-10 rotate-12`} />
  if (kind === 'sprig-bottom') return <Sprig className={`${cls} -bottom-[3.2vw] left-[46%] w-[3vw] min-w-8 rotate-180`} />
  return null
}

export default function Locations() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const u = () => setDesktop(mq.matches)
    u()
    mq.addEventListener('change', u)
    return () => mq.removeEventListener('change', u)
  }, [])

  // Gentle horizontal drift of the photo row while the section scrolls by
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  return (
    <section
      ref={ref}
      id="locations"
      aria-labelledby="locations-title"
      className="relative overflow-hidden bg-[#66624F] text-ivory"
    >
      {/* subtle damask-like texture + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1.2px),radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1.2px)] [background-position:0_0,3px_3px] [background-size:6px_6px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(30,28,22,0.45)_100%)]" />

      <div className="relative py-16 sm:py-20 lg:py-24">
        <Reveal className="container-site text-center">
          <p className="font-display text-[1.25rem] italic leading-snug text-ivory/90 sm:text-2xl">
            Biển xanh, kiến trúc châu Âu, resort sang trọng và hoàng hôn lãng{NB}mạn
          </p>
        </Reveal>

        {/* Photo row — bleeds off both edges */}
        <div className="mt-10 overflow-x-auto [scrollbar-width:none] lg:mt-12 lg:flex lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          <motion.ul
            style={desktop && !reduce ? { x } : undefined}
            className="flex w-max shrink-0 items-start gap-[3vw] px-6 lg:gap-[1.8vw] lg:px-0"
          >
            {locationTiles.map((tile) => (
              <li
                key={tile.src}
                className="relative shrink-0 [margin-top:calc(var(--mt)*1.6)] [width:var(--mw)] lg:[margin-top:var(--mt)] lg:[width:var(--w)]"
                style={{ '--w': `${tile.w}vw`, '--mw': `${tile.w * 3}vw`, '--mt': `${tile.mt}vw` }}
              >
                <div className={`zoom-frame w-full ${tile.ratio} shadow-[0_18px_40px_rgba(0,0,0,0.25)]`}>
                  <Photo image={tile} alt={tile.alt} position={tile.position} sizes="(min-width:1024px) 22vw, 60vw" eager />
                </div>
                {tile.deco && <Deco kind={tile.deco} />}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Giant translucent script title overlapping the bottom of the photos */}
        <h2
          id="locations-title"
          data-split="chars"
          className="title-script pointer-events-none relative z-20 -mt-[9vw] px-4 text-center text-[13vw] !leading-[1.15] text-ivory/45 sm:-mt-[7vw] sm:text-[10vw] lg:-mt-[5.5vw] lg:text-[7.6vw]"
        >
          Khám phá vẻ đẹp Phú{NB}Quốc.
        </h2>

        <Reveal className="container-site mt-4 text-center sm:mt-6">
          <p className="mx-auto max-w-2xl text-[14px] leading-relaxed text-ivory/75 sm:text-[15px]">
            Từ bãi biển cát trắng và ánh hoàng hôn, những con phố mang kiến trúc châu Âu cổ điển đến không gian resort cao cấp —
            Phú Quốc mang đến cho mỗi bộ ảnh một bối cảnh riêng, lãng mạn và đầy cảm{NB}xúc.
          </p>
          <ul className="label mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-ivory/70">
            {locations.map((l, i) => (
              <li key={l.id} className="flex items-center gap-6">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-champagne" />}
                {l.title}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
