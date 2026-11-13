// Smooth scrolling (Lenis, tuned like k95.it: lerp 0.05) synced with GSAP ScrollTrigger.
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
const HEADER_OFFSET = -76

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Jump to the very top, both natively and in Lenis. */
function toTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  lenis?.scrollTo(0, { immediate: true, force: true })
}

/**
 * Always start at the top on load / reload:
 * - no browser scroll restoration, no #hash jump
 * - no ScrollTrigger "scroll memory" (it re-applies the old position on refresh)
 * - position stored as 0 right before leaving the page
 * - re-assert the top after late layout shifts (fonts, images, pin spacers) until the visitor scrolls
 */
export function resetScrollOnLoad() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  ScrollTrigger.clearScrollMemory('manual')
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
  toTop()

  let userScrolled = false
  const markUser = () => (userScrolled = true)
  ;['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((ev) => window.addEventListener(ev, markUser, { once: true, passive: true }))
  const settle = () => !userScrolled && toTop()
  window.addEventListener('DOMContentLoaded', settle)
  window.addEventListener('load', () => {
    settle()
    setTimeout(settle, 150)
    setTimeout(settle, 600)
  })
  document.fonts?.ready.then(settle)
  ScrollTrigger.addEventListener('refresh', settle)

  // Leaving / reloading: store 0 so nothing can restore the old spot
  window.addEventListener('beforeunload', toTop)
  window.addEventListener('pagehide', toTop)
  window.addEventListener('pageshow', (e) => e.persisted && toTop())
}

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return null
  lenis = new Lenis({ lerp: 0.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1, syncTouch: true, syncTouchLerp: 0.05 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis.scrollTo(0, { immediate: true })

  // In-page anchors go through Lenis so they glide instead of jumping.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    const target = id === '#' ? null : document.querySelector(id)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: id === '#home' ? 0 : HEADER_OFFSET, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  })
  return lenis
}

export const getLenis = () => lenis

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Pause page scrolling (menus, lightbox). */
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (!lenis) return
  locked ? lenis.stop() : lenis.start()
}
