import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { img } from '../data/images.js'
import LiquidImage from './ui/LiquidImage.jsx'
import CurvedCarousel from './ui/CurvedCarousel.jsx'

const ease = [0.16, 1, 0.3, 1]
const rise = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease, delay },
})

// 12 distinct photos, repeated once to fill the ring (duplicates sit 180° apart, never visible together)
const ringPhotos = [
  ['pf-sunset-couple', 'Cặp đôi nắm tay trên biển hoàng hôn', '50% 50%'],
  ['loc-euro-bridge', 'Cô dâu trên cầu kiến trúc cổ điển', '45% 60%'],
  ['pf-palm-swing', 'Cô dâu ngồi xích đu dưới cây dừa', '50% 60%'],
  ['hero-couple-beach', 'Cô dâu chú rể trên bãi biển Phú Quốc', '50% 35%'],
  ['pf-anniversary', 'Cặp đôi kỷ niệm bên bóng bay lúc hoàng hôn', '50% 50%'],
  ['loc-euro-plaza', 'Cô dâu chú rể giữa quảng trường châu Âu', '60% 55%'],
  ['pf-ring', 'Cô gái khoe nhẫn cầu hôn trên biển', '50% 40%'],
  ['loc-sunset-palm', 'Bóng cặp đôi dưới tán dừa lúc hoàng hôn', '50% 60%'],
  ['pf-family-sunset', 'Bố cõng con trên vai lúc hoàng hôn', '50% 50%'],
  ['loc-resort-garden', 'Gia đình trong khu vườn resort', '50% 50%'],
  ['pf-palm-sunset', 'Cặp đôi dưới cây dừa nghiêng', '50% 70%'],
  ['loc-sunset-kiss', 'Cặp đôi hôn nhau lúc chạng vạng', '50% 40%'],
].map(([k, alt, position]) => ({ ...img[k], alt, position }))
const ring = [...ringPhotos, ...ringPhotos]

export default function Hero() {
  return (
    <section id="home" aria-label="Giới thiệu" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-charcoal-deep text-ivory">
      {/* Background photo (k95 liquid shader) */}
      <div className="absolute inset-0">
        <div className="hero-zoom absolute inset-0">
          <LiquidImage image={img['loc-beach-palms']} alt="Hàng dừa và bãi cát trắng Phú Quốc" position="50% 70%" eager intensity={0.22} liquid={0.45} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/55 via-charcoal-deep/35 to-charcoal-deep/85" />
      </div>

      {/* Centred copy */}
      <div className="container-site relative flex flex-col items-center pt-32 text-center sm:pt-40 lg:pt-[19vh]">
        <h1 className="title-script text-[2.7rem] sm:text-[3.8rem] lg:text-[4.6rem]">
          <span data-split="chars" data-split-load="" data-delay="0.3" className="block">
            Tình yêu của bạn,
          </span>
          <span data-split="chars" data-split-load="" data-delay="0.5" className="block text-sand">
            nghệ thuật của chúng tôi.
          </span>
        </h1>
        <motion.p {...rise(0.8)} className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory/80 sm:text-base">
          Nơi mỗi khoảnh khắc trở thành kỷ niệm vượt thời gian — chụp ảnh cưới, sự kiện và cho thuê váy cưới tại Phú{' '}Quốc.
        </motion.p>
        <motion.div {...rise(0.95)} className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-[14px] font-medium text-charcoal transition-colors duration-300 hover:bg-sand"
          >
            Khám phá tác phẩm <ArrowRight size={15} strokeWidth={1.5} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-6 py-3 text-[14px] font-medium text-ivory backdrop-blur-md transition-colors duration-300 hover:bg-white/25"
          >
            Đặt lịch chụp
          </a>
        </motion.div>
      </div>

      {/* Concave 3D photo ring sitting on the bottom edge */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease, delay: 0.9 }}
        className="relative mt-auto translate-y-[12%]"
      >
        <CurvedCarousel images={ring} />
      </motion.div>
    </section>
  )
}
