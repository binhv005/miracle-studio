import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { img } from '../data/images.js'
import { prefersReducedMotion } from '../lib/smooth.js'
import { services } from '../data/services.js'
import { Photo, Reveal } from './ui/primitives.jsx'

gsap.registerPlugin(ScrollTrigger)

const NB = ' '

export function selectService(id) {
  window.dispatchEvent(new CustomEvent('miracle:select-service', { detail: id }))
}

/** Small crossed-lines ornament (sits above and below the card row). */
function Crossed({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 40" className={`mx-auto h-8 w-14 text-ivory/80 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 6 L56 34" />
      <path d="M56 6 L8 34" />
      <path d="M12 4 L4 12 M52 4 L60 12 M12 36 L4 28 M52 36 L60 28" strokeWidth="1" />
      <circle cx="32" cy="20" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Front of a card: a lace-edged invitation (inspired by printed wedding invites). */
function InvitationFace({ s }) {
  return (
    <div className="relative h-full p-[7px] [background:radial-gradient(circle,#F3EBDD_4.2px,transparent_4.8px)_0_0/11px_11px]">
      {/* scalloped "lace" edge above, solid panel inside */}
      <div className="flex h-full flex-col items-center justify-center bg-[#F3EBDD] px-3 text-center text-charcoal-deep outline-dotted outline-1 outline-offset-[-7px] outline-champagne/70">
        <p className="text-[8.5px] font-medium uppercase tracking-[0.28em] text-charcoal/60">Miracle Studio</p>
        <p className="mt-1 text-[8.5px] uppercase tracking-[0.22em] text-charcoal/50">trân trọng giới thiệu</p>
        <p className="mt-5 font-display text-[11px] italic text-champagne-dark">No. {s.no}</p>
        <p className="title-script mt-1 text-[1.9rem] leading-[1.15] text-[#4A2C2A]">{s.title}</p>
        <span aria-hidden="true" className="mt-3 flex items-center gap-2 text-champagne">
          <span className="h-px w-6 bg-current" />
          <span className="h-1 w-1 rotate-45 bg-current" />
          <span className="h-px w-6 bg-current" />
        </span>
        <p className="mt-3 max-w-[11rem] text-[10.5px] leading-relaxed text-charcoal/70">{s.text}</p>
        <p className="mt-5 text-[8.5px] uppercase tracking-[0.28em] text-charcoal/55">Phú Quốc</p>
      </div>
    </div>
  )
}

/**
 * Services as a row of cream cards over a dark photographic ground.
 * Odd cards: number + title on top, photo below. Even cards: photo on top, title below.
 */
export default function Services() {
  const rowRef = useRef(null)

  // Scroll-driven flip, left card first: invitation (front) turns to the photo card (back).
  useLayoutEffect(() => {
    const cards = [...rowRef.current.querySelectorAll('[data-flip]')]
    if (prefersReducedMotion()) {
      gsap.set(cards, { rotateY: 180 })
      return
    }
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotateY: 0 },
          {
            rotateY: 180,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: rowRef.current,
              start: `top ${88 - i * 7}%`,
              end: `top ${48 - i * 7}%`,
              scrub: 0.8,
            },
          },
        )
      })
    }, rowRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" aria-labelledby="services-title" className="relative overflow-hidden bg-charcoal-deep text-ivory">
      {/* Dark photo background */}
      <div aria-hidden="true" className="absolute inset-0">
        <Photo image={img['pf-family-garden']} alt="" sizes="100vw" position="50% 40%" className="scale-110 blur-[6px]" />
        <div className="absolute inset-0 bg-charcoal-deep/[0.86]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(43,40,37,0.85)_100%)]" />
      </div>

      <div className="relative py-16 sm:py-20 lg:py-24">
        <div className="container-site text-center">
          <h2 id="services-title" data-split="chars" className="mx-auto max-w-3xl title-script text-[2.6rem] text-ivory sm:text-[3.4rem] lg:text-[4.2rem]">
            Lưu giữ kỷ niệm, <em className="text-champagne">kiến tạo nghệ{NB}thuật.</em>
          </h2>
          <Reveal>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/70 sm:text-base">
              Năm dịch vụ trọn vẹn cho hành trình của bạn tại Phú Quốc — chọn một dịch vụ để được tư vấn{NB}ngay.
            </p>
          </Reveal>
          <Crossed className="mt-10" />
        </div>

        {/* Card row: swipe on phones, full row on desktop. Cards flip (invitation → photo) on scroll. */}
        <ul
          ref={rowRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:px-10 lg:mx-auto lg:max-w-[1180px] lg:justify-center lg:gap-5 lg:overflow-visible lg:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {services.map((s, i) => {
            const titleTop = i % 2 === 0
            const head = (
              <div className={`flex min-h-[5.6rem] shrink-0 flex-col px-1 ${titleTop ? 'justify-start pb-3 pt-1' : 'justify-end pb-1 pt-3'}`}>
                <span className="text-[11px] font-medium tracking-[0.2em] text-charcoal/60">{s.no}</span>
                <h3 className="title-script mt-1 text-[1.75rem] leading-[1.15] text-charcoal-deep">{s.title}</h3>
              </div>
            )
            return (
              <li key={s.id} className="w-[68vw] max-w-[260px] shrink-0 snap-center sm:w-[42vw] lg:w-auto lg:flex-1">
                <a
                  href="#contact"
                  onClick={() => selectService(s.id)}
                  data-cursor="Chọn"
                  aria-label={`${s.title} — ${s.text}`}
                  className="relative block aspect-[5/9] [perspective:1400px]"
                >
                  <div data-flip="" className="absolute inset-0 [transform-style:preserve-3d]">
                    {/* FRONT — wedding-invitation face */}
                    <div className="absolute inset-0 overflow-hidden bg-[#4A2C2A] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.4)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                      <div aria-hidden="true" className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(197,164,109,0.18)_1px,transparent_1.4px)] [background-size:7px_7px]" />
                      <InvitationFace s={s} />
                    </div>
                    {/* BACK — photo card */}
                    <div className="absolute inset-0 flex flex-col bg-[#EFE6D6] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
                      {titleTop && head}
                      <div className="zoom-frame relative min-h-0 w-full flex-1 overflow-hidden">
                        <Photo image={s.image} alt={s.alt} position={s.position} sizes="(min-width:1024px) 220px, 68vw" />
                      </div>
                      {!titleTop && head}
                    </div>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>

        <Crossed className="mt-8" />
      </div>
    </section>
  )
}
