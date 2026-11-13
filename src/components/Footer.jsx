import { ArrowUpRight, Facebook, MapPin, Phone } from 'lucide-react'
import { nav, site } from '../data/site.js'
import { services } from '../data/services.js'
import logoGold from '../assets/images/logo-gold.png'

export default function Footer() {
  return (
    <footer className="relative bg-charcoal-deep text-ivory">
      <div className="container-site border-t border-ivory/10 pb-8 pt-12 sm:pt-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src={logoGold} alt="Miracle Studio Phu Quoc" width="600" height="455" loading="lazy" className="h-28 w-auto" />
            <p className="mt-6 max-w-xs text-[15px] text-ivory/60">
              Chụp ảnh cưới · Chụp sự kiện · Cho thuê váy cưới tại Phú Quốc.
            </p>
          </div>

          <FooterCol title="Điều hướng" className="lg:col-span-2 lg:col-start-6">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-champagne">
                  {n.label}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Dịch vụ" className="lg:col-span-2">
            {services.map((s) => (
              <li key={s.id}>
                <a href="#services" className="hover:text-champagne">
                  {s.title}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Liên hệ" className="lg:col-span-3">
            <li className="flex gap-3">
              <MapPin size={15} strokeWidth={1.5} className="mt-1 shrink-0 text-champagne" />
              <a href={site.maps} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                {site.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone size={15} strokeWidth={1.5} className="mt-1 shrink-0 text-champagne" />
              <a href={site.phoneHref} className="hover:text-champagne">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Facebook size={15} strokeWidth={1.5} className="mt-1 shrink-0 text-champagne" />
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-champagne">
                miraclestudiovn <ArrowUpRight size={12} />
              </a>
            </li>
          </FooterCol>
        </div>

        {/* k95-style giant wordmark: letters rise from a mask */}
        <p aria-hidden="true" data-split="chars" className="mt-20 select-none text-center font-display text-[24vw] leading-[1] tracking-[-0.04em] text-champagne lg:text-[21vw]">
          Miracle
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-[13px] text-ivory/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Miracle Studio. Bảo lưu mọi quyền.</p>
          <p>Phú Quốc · Việt Nam</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, className = '', children }) {
  return (
    <div className={className}>
      <h3 className="label mb-6 font-sans text-champagne">{title}</h3>
      <ul className="space-y-3 text-[15px] text-ivory/70 [&_a]:transition-colors">{children}</ul>
    </div>
  )
}
