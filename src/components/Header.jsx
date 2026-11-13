import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Phone } from 'lucide-react'
import { nav, site } from '../data/site.js'
import { lockScroll } from '../lib/smooth.js'
import logoIvory from '../assets/images/logo-ivory.png'
import logoCharcoal from '../assets/images/logo-charcoal.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section in view.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    lockScroll(open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const light = !scrolled || open

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Floating frosted-glass bar */}
      <div
        className={`relative z-10 mx-auto flex h-[60px] max-w-site items-center justify-between gap-4 rounded-2xl border px-2.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:h-[64px] ${
          light
            ? 'border-white/15 bg-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.18)]'
            : 'border-charcoal/10 bg-ivory/80 shadow-[0_10px_40px_rgba(55,51,47,0.10)]'
        }`}
      >
        <a href="#home" className="flex shrink-0 items-center gap-3" aria-label="Miracle Studio – trang chủ">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-500 ${
              light ? 'border-white/20 bg-white/15 text-ivory' : 'border-charcoal/10 bg-charcoal/5 text-charcoal'
            }`}
          >
            <Home size={18} strokeWidth={1.5} />
          </span>
          <img
            src={light ? logoIvory : logoCharcoal}
            alt="Miracle Studio Phu Quoc"
            width="600"
            height="455"
            className="h-10 w-auto sm:h-11"
          />
        </a>

        <nav aria-label="Điều hướng chính" className="absolute left-1/2 hidden -translate-x-1/2 xl:block">
          <ul className="flex items-center gap-1 whitespace-nowrap">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`relative block whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-300 ${
                    active === item.href
                      ? light
                        ? 'bg-white/15 text-ivory'
                        : 'bg-charcoal/[0.06] text-charcoal'
                      : light
                        ? 'text-ivory/80 hover:text-ivory'
                        : 'text-charcoal/65 hover:text-charcoal'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className={`hidden whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-500 sm:inline-flex ${
              light ? 'bg-ivory text-charcoal hover:bg-sand' : 'bg-charcoal text-ivory hover:bg-champagne-dark'
            }`}
          >
            Đặt lịch
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors duration-500 xl:hidden ${
              light ? 'border-white/20 bg-white/10 text-ivory' : 'border-charcoal/10 text-charcoal'
            }`}
          >
            <span>{open ? 'Đóng' : 'Menu'}</span>
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'top-1 -rotate-45' : 'top-2.5'}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 -z-0 flex flex-col bg-charcoal-deep pt-[96px] text-ivory xl:hidden"
          >
            <nav
              aria-label="Điều hướng di động"
              data-lenis-prevent
              className="container-site min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
            >
              <ul className="border-t border-ivory/10">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.6 }}
                    className="border-b border-ivory/10"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-4 font-display text-[2rem] leading-[1.2] sm:text-5xl"
                    >
                      {item.label}
                      <span className="label text-champagne">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-site flex shrink-0 items-center gap-3 py-6">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-gold flex-1 whitespace-nowrap px-3 tracking-[0.16em]"
              >
                Đặt lịch
              </a>
              <a href={site.phoneHref} className="btn-light flex-1 gap-2 whitespace-nowrap px-3 tracking-[0.12em]">
                <Phone size={14} strokeWidth={1.5} /> {site.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
