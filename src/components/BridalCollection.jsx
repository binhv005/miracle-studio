import { ArrowUpRight } from 'lucide-react'
import { img } from '../data/images.js'
import { site } from '../data/site.js'
import { selectService } from './Services.jsx'
import { ImageReveal, Reveal } from './ui/primitives.jsx'

const points = [
  'Nhiều phong cách váy cưới và vest',
  'Bộ sưu tập được cập nhật thường xuyên',
  'Miễn phí thử váy',
  'Tư vấn trang phục phù hợp concept chụp ảnh',
]

export default function BridalCollection() {
  return (
    <section id="bridal" aria-labelledby="bridal-title" className="relative bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="container-site grid grid-cols-12 gap-x-8 gap-y-14">
        {/* Sticky editorial text column */}
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <h2 id="bridal-title" data-split="chars" className="title-lg">
                Tìm chiếc váy <em className="text-champagne-dark">kể câu chuyện</em> của bạn.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-charcoal/75">
                Cho thuê váy cưới và vest cho buổi chụp và ngày trọng đại — chọn trang phục cùng ekip để mỗi khung hình đúng với
                câu chuyện của bạn.
              </p>
              <ol className="mt-10 border-t border-charcoal/15">
                {points.map((p, i) => (
                  <li key={p} className="flex items-baseline gap-6 border-b border-charcoal/15 py-4">
                    <span className="font-display text-lg italic text-champagne-dark">0{i + 1}</span>
                    <span className="text-[15px]">{p}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="btn">
                  Xem bộ sưu tập <ArrowUpRight size={15} strokeWidth={1.5} />
                </a>
                <a href="#contact" onClick={() => selectService('bridal')} className="btn-solid">
                  Đặt lịch thử váy
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Image column: one hero gown + detail close-ups */}
        <div className="col-span-12 grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-6 lg:col-start-7">
          <figure className="col-span-2">
            <ImageReveal
              image={img['bridal-gown-beach']}
              alt="Cô dâu trong váy cưới trắng đuôi dài trên bãi biển"
              sizes="(min-width:1024px) 45vw, 100vw"
              position="50% 30%"
              className="aspect-[4/5]"
            />
            <figcaption className="label mt-3 flex justify-between text-charcoal/55">
              <span>Váy cưới</span>
              <span>Phong cách cô dâu</span>
            </figcaption>
          </figure>
          <figure className="mt-10 sm:mt-24">
            <ImageReveal
              image={img['bridal-veil-detail']}
              alt="Cận cảnh cô dâu với khăn voan đính ngọc và váy cúp ngực"
              sizes="(min-width:1024px) 22vw, 50vw"
              position="50% 40%"
              className="aspect-[3/4]"
              parallax={24}
            />
            <figcaption className="label mt-3 text-charcoal/55">Chi tiết khăn voan</figcaption>
          </figure>
          <figure>
            <ImageReveal
              image={img['bridal-lace-detail']}
              alt="Cận cảnh váy cưới ren cổ cao đính đá"
              sizes="(min-width:1024px) 22vw, 50vw"
              position="50% 55%"
              className="aspect-[3/4]"
              parallax={24}
            />
            <figcaption className="label mt-3 text-charcoal/55">Chi tiết ren</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
