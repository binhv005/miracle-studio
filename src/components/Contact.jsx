import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Facebook, MapPin, MessageCircle, Phone } from 'lucide-react'
import { services } from '../data/services.js'
import { site } from '../data/site.js'
import { Photo, Reveal } from './ui/primitives.jsx'
import { img } from '../data/images.js'

const empty = { name: '', phone: '', email: '', service: '', date: '', message: '' }
const today = () => new Date().toISOString().slice(0, 10)

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Vui lòng nhập họ tên.'
  const phone = v.phone.replace(/[\s.-]/g, '')
  if (!/^(\+?\d{9,15})$/.test(phone)) e.phone = 'Số điện thoại chưa hợp lệ.'
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = 'Email chưa hợp lệ.'
  if (!v.service) e.service = 'Vui lòng chọn dịch vụ.'
  if (v.date && v.date < today()) e.date = 'Ngày dự kiến không thể ở quá khứ.'
  return e
}

export default function Contact() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)
  const [copied, setCopied] = useState(false)

  // Service CTAs elsewhere on the page pre-select the service here.
  useEffect(() => {
    const onSelect = (e) => setValues((v) => ({ ...v, service: e.detail }))
    window.addEventListener('miracle:select-service', onSelect)
    return () => window.removeEventListener('miracle:select-service', onSelect)
  }, [])

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const er = validate(values)
    setErrors(er)
    if (Object.keys(er).length) {
      document.getElementById(`f-${Object.keys(er)[0]}`)?.focus()
      return
    }
    // No backend yet: the request is summarised so the client can send it
    // straight to the studio via Messenger or a call. Plug an API call here later.
    const svc = services.find((s) => s.id === values.service)?.title
    const summary = [
      'Yêu cầu tư vấn – Miracle Studio',
      `Họ tên: ${values.name}`,
      `SĐT: ${values.phone}`,
      values.email && `Email: ${values.email}`,
      `Dịch vụ: ${svc}`,
      values.date && `Ngày dự kiến: ${values.date}`,
      values.message && `Lời nhắn: ${values.message}`,
    ]
      .filter(Boolean)
      .join('\n')
    setSent(summary)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-charcoal-deep text-ivory">
      <div className="grid lg:grid-cols-2">
        {/* Left half: photo background reaching the screen edge */}
        <div className="contact-left relative overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:py-24">
          <div aria-hidden="true" className="absolute inset-0">
            <Photo image={img['loc-sunset-kiss']} alt="" sizes="(min-width:1024px) 50vw, 100vw" position="50% 35%" />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/70 via-charcoal-deep/55 to-charcoal-deep/85 lg:bg-gradient-to-r lg:from-charcoal-deep/80 lg:via-charcoal-deep/55 lg:to-charcoal-deep/75" />
          </div>
          <div className="relative">
          <Reveal>
            <h2 id="contact-title" data-split="chars" className="title-lg text-ivory">
              Cùng nhau tạo nên <em className="text-champagne">những điều tuyệt đẹp.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <address className="mt-12 space-y-6 not-italic">
              <div>
                <p className="field-label">Địa chỉ studio</p>
                <p className="font-display text-xl">MIRACLE STUDIO</p>
                <p className="mt-1 max-w-sm text-[15px] text-ivory/70">{site.address}</p>
              </div>
              <div>
                <p className="field-label">Hotline · {site.representative}</p>
                <a href={site.phoneHref} className="font-display text-3xl transition-colors hover:text-champagne">
                  {site.phoneDisplay}
                </a>
              </div>
            </address>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href={site.phoneHref} className="btn-gold">
                <Phone size={14} strokeWidth={1.5} /> Gọi ngay
              </a>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="btn-light">
                <Facebook size={14} strokeWidth={1.5} /> Facebook
              </a>
              {site.whatsapp && (
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-light">
                  <MessageCircle size={14} strokeWidth={1.5} /> WhatsApp
                </a>
              )}
            </div>

          </Reveal>
          </div>
        </div>

        {/* Right half: form */}
        <Reveal delay={0.15} className="contact-right px-6 py-16 sm:px-10 sm:py-20 lg:py-24">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                <p className="text-[15px] text-ivory/70 sm:col-span-2">
                  Để lại thông tin, Miracle Studio sẽ liên hệ tư vấn cho bạn trong thời gian sớm nhất.
                </p>
                <Field id="name" label="Họ và tên *" error={errors.name}>
                  <input id="f-name" className="field" autoComplete="name" value={values.name} onChange={set('name')} placeholder="Nguyễn Văn A" />
                </Field>
                <Field id="phone" label="Số điện thoại *" error={errors.phone}>
                  <input id="f-phone" type="tel" inputMode="tel" className="field" autoComplete="tel" value={values.phone} onChange={set('phone')} placeholder="09xx xxx xxx" />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input id="f-email" type="email" className="field" autoComplete="email" value={values.email} onChange={set('email')} placeholder="email@domain.com" />
                </Field>
                <Field id="date" label="Ngày dự kiến chụp" error={errors.date}>
                  <input id="f-date" type="date" min={today()} className="field [color-scheme:dark]" value={values.date} onChange={set('date')} />
                </Field>
                <Field id="service" label="Dịch vụ quan tâm *" error={errors.service} wide>
                  <select id="f-service" className="field cursor-pointer" value={values.service} onChange={set('service')}>
                    <option value="" className="text-charcoal">
                      Chọn dịch vụ
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="text-charcoal">
                        {s.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="message" label="Lời nhắn" wide>
                  <textarea id="f-message" rows={4} className="field resize-none" value={values.message} onChange={set('message')} placeholder="Concept, số lượng người, địa điểm mong muốn…" />
                </Field>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-gold w-full sm:w-auto">
                    Gửi yêu cầu tư vấn <ArrowRight size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border border-ivory/15 p-8 sm:p-12" role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne text-champagne">
                  <Check size={20} strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 text-3xl">Cảm ơn {values.name.split(' ').slice(-1)[0]}!</h3>
                <p className="mt-4 text-ivory/70">
                  Thông tin của bạn đã sẵn sàng. Gửi trực tiếp qua Messenger hoặc gọi hotline để Miracle Studio phản hồi nhanh nhất.
                </p>
                <pre className="mt-6 whitespace-pre-wrap bg-ivory/5 p-5 font-sans text-sm leading-relaxed text-ivory/80">{sent}</pre>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={site.messenger} target="_blank" rel="noopener noreferrer" onClick={copy} className="btn-gold">
                    <MessageCircle size={14} strokeWidth={1.5} /> Gửi qua Messenger
                  </a>
                  <a href={site.phoneHref} className="btn-light">
                    <Phone size={14} strokeWidth={1.5} /> {site.phoneDisplay}
                  </a>
                  <button type="button" onClick={copy} className="btn-light">
                    <Copy size={14} strokeWidth={1.5} /> {copied ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSent(null)
                    setValues(empty)
                  }}
                  className="link-underline mt-8 text-ivory/60"
                >
                  Gửi yêu cầu khác
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>

      {/* Full-width map strip */}
      <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[480px]">
        <iframe
          title="Bản đồ Miracle Studio Phú Quốc"
          src={site.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 grayscale-[60%] sepia-[15%]"
        />
        <a
          href={site.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 inline-flex items-center gap-2 whitespace-nowrap rounded-full sm:right-6 sm:top-6 bg-charcoal-deep px-5 py-3 text-[14px] font-medium text-ivory shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-colors hover:bg-champagne-dark"
        >
          <MapPin size={15} strokeWidth={1.5} /> Mở Google Maps
        </a>
      </div>
    </section>
  )
}

function Field({ id, label, error, wide, children }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={`f-${id}`} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`f-${id}-error`} role="alert" className="mt-2 text-[13px] text-[#E8B4A0]">
          {error}
        </p>
      )}
    </div>
  )
}
