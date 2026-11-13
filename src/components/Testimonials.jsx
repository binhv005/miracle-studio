import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Star } from 'lucide-react'
import { img } from '../data/images.js'
import { site } from '../data/site.js'
import { testimonials } from '../data/testimonials.js'
import { ImageReveal, Reveal } from './ui/primitives.jsx'

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="relative bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="container-site grid grid-cols-12 items-center gap-x-8 gap-y-14">
        <ImageReveal
          image={img['testimonial-couple']}
          alt="Cặp đôi hôn nhau trên bãi biển trong trang phục trắng"
          sizes="(min-width:1024px) 38vw, 100vw"
          position="50% 30%"
          className="col-span-12 aspect-[4/5] sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-1"
        />

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <h2 id="testimonials-title" data-split="chars" className="title-lg">
              Lời chia sẻ <em className="text-champagne-dark">từ các cặp đôi.</em>
            </h2>
          </Reveal>

          {testimonials.length > 0 ? <Slider /> : <FacebookRating />}
        </div>
      </div>
    </section>
  )
}

/** Verified public rating (from the brief) — shown until real reviews are added. */
function FacebookRating() {
  return (
    <Reveal delay={0.1} className="mt-12">
      <div className="flex items-end gap-6 border-y border-charcoal/15 py-10">
        <span className="font-display text-[6rem] leading-[0.8] tracking-[-0.03em] sm:text-[8rem]">98%</span>
        <div className="pb-2">
          <div className="flex gap-1 text-champagne" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <p className="label mt-3 text-charcoal/60">Đề xuất · 566 đánh giá</p>
        </div>
      </div>
      <blockquote className="mt-10 font-display text-2xl italic leading-snug text-charcoal/85 sm:text-[2rem]">
        Những lời nhận xét chân thật nhất đến từ chính các cặp đôi đã đồng hành cùng Miracle Studio.
      </blockquote>
      <a href={site.facebookReviews} target="_blank" rel="noopener noreferrer" className="btn-solid mt-10">
        Xem đánh giá trên Facebook <ArrowUpRight size={15} strokeWidth={1.5} />
      </a>
    </Reveal>
  )
}

/** Template-style quote slider with PREV / NEXT text controls. */
function Slider() {
  const [i, setI] = useState(0)
  const t = testimonials[i]
  const go = (d) => setI((v) => (v + d + testimonials.length) % testimonials.length)
  return (
    <div className="mt-12">
      <div className="min-h-[14rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6 }}>
            <blockquote className="font-display text-2xl italic leading-snug sm:text-[2rem]">“{t.quote}”</blockquote>
            <figcaption className="label mt-8 text-charcoal/60">— {t.name}</figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-10 flex items-center gap-8 border-t border-charcoal/15 pt-6">
        <button onClick={() => go(-1)} className="font-display text-3xl uppercase transition-colors hover:text-champagne-dark">
          Trước
        </button>
        <span className="label text-charcoal/50">
          {i + 1} / {testimonials.length}
        </span>
        <button onClick={() => go(1)} className="font-display text-3xl uppercase transition-colors hover:text-champagne-dark">
          Sau
        </button>
        <a href={site.facebookReviews} target="_blank" rel="noopener noreferrer" className="link-underline ml-auto">
          Facebook <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  )
}
