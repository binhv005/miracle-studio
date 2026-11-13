import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { img } from '../data/images.js'
import { selectService } from './Services.jsx'
import { Reveal } from './ui/primitives.jsx'
import LiquidImage from './ui/LiquidImage.jsx'

export default function SpecialOffer() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%'])

  return (
    <section ref={ref} aria-labelledby="offer-title" className="relative overflow-hidden text-ivory">
      <motion.div className="absolute inset-[-14%_0]" style={{ y }}>
        <LiquidImage image={img['offer-sunset']} alt="" position="50% 50%" intensity={0.28} liquid={0.5} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep/80 via-charcoal-deep/45 to-charcoal-deep/10" />

      <div className="container-site relative grid min-h-[60vh] items-center gap-10 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 id="offer-title" data-split="chars" className="title-xl">
              Để ngày cưới <em className="text-sand">thêm trọn vẹn.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ivory/90">
              Giảm ngay <strong className="font-medium text-champagne">10%</strong> gói chụp ngày cưới khi đặt gói Prewedding tại MIRACLE STUDIO.
            </p>
            <a href="#contact" onClick={() => selectService('prewedding')} className="btn-gold mt-10">
              Nhận ưu đãi <ArrowRight size={15} strokeWidth={1.5} />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.25} className="hidden lg:col-span-5 lg:block">
          <p aria-hidden="true" className="text-outline text-right font-display text-[15rem] leading-none text-ivory/70">
            10<span className="text-[8rem]">%</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
