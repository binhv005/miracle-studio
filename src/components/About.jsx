import { img } from '../data/images.js'
import { ImageReveal, Reveal } from './ui/primitives.jsx'

const NB = ' '

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="container-site">
        {/* Row 1 — headline left, intro right, aligned on the baseline */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 lg:items-end">
          <div className="col-span-12 lg:col-span-8">
            <h2
              id="about-title"
              data-split="chars"
              className="title-script text-[2.5rem] sm:text-[3.4rem] lg:text-[4rem]"
            >
              <span className="block">Hơn cả nhiếp{NB}ảnh,</span>
              <em className="block text-champagne-dark">đó là câu chuyện của{NB}bạn.</em>
            </h2>
          </div>
          <Reveal className="col-span-12 sm:col-span-9 lg:col-span-4 lg:pb-3">
            <p className="text-[15px] leading-relaxed text-charcoal/80 sm:text-base">
              Với hơn 15 năm kinh nghiệm, <strong className="font-medium text-charcoal">MIRACLE{NB}STUDIO</strong> không chỉ ghi
              lại những khoảnh khắc mà còn kể câu chuyện tình yêu thông qua từng khung hình nghệ{NB}thuật.
            </p>
          </Reveal>
        </div>

        {/* Row 2 — asymmetric image composition */}
        <div className="mt-10 grid grid-cols-12 gap-x-4 gap-y-6 sm:mt-14 lg:gap-x-8">
          <ImageReveal
            image={img['about-couple-portrait']}
            alt="Cặp đôi khiêu vũ bên biển trong trang phục tông kem"
            sizes="(min-width:1024px) 48vw, 100vw"
            position="50% 30%"
            className="col-span-12 aspect-[4/5] lg:col-span-6"
          />

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-6 lg:gap-8">
            <ImageReveal
              image={img['about-sunset-pier']}
              alt="Cặp đôi ôm nhau trên bãi biển trước cây cầu lúc hoàng hôn"
              sizes="(min-width:1024px) 48vw, 100vw"
              position="50% 55%"
              className="aspect-[3/2] w-full lg:w-[88%] lg:self-end"
            />
            <div className="grid grid-cols-12 items-end gap-x-4 gap-y-6 lg:mt-auto lg:gap-x-8">
              <ImageReveal
                image={img['about-veil-bw']}
                alt="Ảnh đen trắng cô dâu với khăn voan dài tựa vào chú rể"
                sizes="(min-width:1024px) 20vw, 40vw"
                position="50% 30%"
                className="col-span-5 aspect-[3/4]"
                parallax={24}
              />
              <Reveal className="col-span-7 pb-1">
                <p className="text-[15px] leading-relaxed text-charcoal/75">
                  Từ những bãi biển xanh trong, bờ cát trắng đến kiến trúc châu Âu sang trọng tại Phú Quốc, mỗi bộ ảnh đều được
                  chăm chút để lưu giữ những cảm xúc chân thật và đáng nhớ{NB}nhất.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
