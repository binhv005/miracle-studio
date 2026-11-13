import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const expoOut = [0.16, 1, 0.3, 1]

/** Responsive, lazy, CLS-safe photo. `image` comes from data/images.js. */
export function Photo({ image, alt, sizes = '100vw', position = '50% 50%', className = '', eager = false, fill = true }) {
  return (
    <img
      src={image.src}
      srcSet={`${image.sm} 720w, ${image.src} ${image.w}w`}
      sizes={sizes}
      width={image.w}
      height={image.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      style={{ objectPosition: position }}
      className={`${fill ? 'absolute inset-0 h-full w-full' : 'block h-auto w-full'} object-cover ${className}`}
    />
  )
}

/**
 * Block reveal (k95 revealBlocks): children rise 24px and fade in, expo.out 1.05s.
 * Driven by GSAP in lib/useK95Effects.js via the data-block hook.
 */
export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Comp = as
  return (
    <Comp data-block="" data-delay={delay || undefined} className={className}>
      {children}
    </Comp>
  )
}

/** Hairline that draws itself from the left (k95 studio-services__line). */
export function Line({ className = '' }) {
  return <span data-line="" aria-hidden="true" className={`block h-px w-full bg-current opacity-20 ${className}`} />
}

/** Image curtain reveal + gentle parallax inside its frame. */
export function ImageReveal({ image, alt, sizes, position, className = '', parallax = 40, eager = false }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-parallax, parallax])

  return (
    <div ref={ref} className={`zoom-frame ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.4, ease: expoOut }}
      >
        <motion.div className="absolute inset-[-60px_0]" style={{ y }}>
          {/* k95 revealItems: media settles from scale 1.12 to 1 while the curtain opens */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1.8, ease: expoOut }}
          >
            <Photo image={image} alt={alt} sizes={sizes} position={position} eager={eager} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Giant infinite marquee word band (template: .infnite-text). */
export function Marquee({ text, className = '', speed = 60, outline = false }) {
  const items = Array.from({ length: 4 }, () => text)
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <div className="marquee" style={{ '--marquee-speed': `${speed}s` }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={outline ? 'text-outline' : ''}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
