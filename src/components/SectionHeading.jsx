import { Line, Marquee, Reveal } from './ui/primitives.jsx'

/**
 * Section opener modelled on the template's "Works / Services" block:
 * hairline, caps title on the left, a short stacked text column on the right,
 * and a giant faint marquee word running behind.
 */
export default function SectionHeading({ id, title, marquee, aside = [], dark = false }) {
  return (
    <div className="relative overflow-hidden">
      <Line className={dark ? 'text-ivory' : 'text-charcoal'} />
      <Marquee
        text={`${marquee} ·`}
        speed={70}
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 font-display text-[34vw] uppercase leading-none lg:text-[22vw] ${
          dark ? 'text-ivory/[0.04]' : 'text-charcoal/[0.045]'
        }`}
      />
      <div className="container-site relative grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:items-end lg:py-20">
        <div className="lg:col-span-8">
          <h2 id={id} data-split="chars" className="title-xl max-w-4xl">
            {title}
          </h2>
        </div>
        {aside.length > 0 && (
          <Reveal delay={0.2} className="lg:col-span-3 lg:col-start-10">
            <ul className={`label space-y-3 leading-relaxed ${dark ? 'text-ivory/60' : 'text-charcoal/60'}`}>
              {aside.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </div>
  )
}
