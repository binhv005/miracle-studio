// Scroll-driven reveal system modelled on k95.it/en/studio (GSAP + ScrollTrigger + SplitText).
// Markup hooks:
//   data-split="chars"   heading: characters slide up from behind a line mask
//   data-split-load      run on page load instead of on scroll (hero)
//   data-delay="0.3"     extra delay in seconds
//   data-block           wrapper whose children rise in (y 24 → 0)
//   data-line            hairline drawn from the left (scaleX 0 → 1)
import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from './smooth.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

const EASE = 'expo.out'

export function useK95Effects() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const root = document.documentElement
    root.classList.add('fx-ready')
    const splits = []

    const ctx = gsap.context(() => {
      // 1. Character reveal for headings (duration 1.1, charStagger .045, lineStagger .08)
      document.querySelectorAll('[data-split="chars"]').forEach((el) => {
        const delay = parseFloat(el.dataset.delay || 0)
        const onLoad = el.hasAttribute('data-split-load')
        // Connected script faces (Great Vibes) must not be split per character, or the joins break.
        const script = getComputedStyle(el).fontFamily.includes('Great Vibes')
        splits.push(
          SplitText.create(el, {
            type: script ? 'lines,words' : 'lines,words,chars',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              const units = script ? self.words : self.chars
              const each = script ? 0.07 : Math.min(0.045, 0.9 / Math.max(1, units.length))
              return gsap.from(units, {
                yPercent: 125,
                duration: 1.1,
                ease: EASE,
                delay,
                stagger: each,
                scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 94%', once: true },
              })
            },
          }),
        )
      })

      // 2. Blocks: children rise in (y 24, 1.05s expo.out); split text inside animates itself.
      document.querySelectorAll('[data-block]').forEach((el) => {
        const kids = [...el.children].filter((c) => !c.matches('[data-split]') && !c.querySelector('[data-split]'))
        const targets = kids.length ? kids : el.querySelector('[data-split]') ? [] : [el]
        if (!targets.length) return
        gsap.from(targets, {
          y: 24,
          autoAlpha: 0,
          duration: 1.05,
          ease: EASE,
          delay: parseFloat(el.dataset.delay || 0),
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      // 3. Hairlines draw from the left (1.1s expo.out, stagger .12)
      document.querySelectorAll('[data-line]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.1, ease: EASE, scrollTrigger: { trigger: el, start: 'top 94%', once: true } },
        )
      })
    })

    // Re-measure once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      splits.forEach((s) => s.revert())
      ctx.revert()
      root.classList.remove('fx-ready')
    }
  }, [])
}
