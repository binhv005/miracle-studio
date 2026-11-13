import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { initSmoothScroll } from './lib/smooth.js'
import { useK95Effects } from './lib/useK95Effects.js'
import Cursor from './components/Cursor.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Locations from './components/Locations.jsx'
import Portfolio from './components/Portfolio.jsx'
import BridalCollection from './components/BridalCollection.jsx'
import WhyChooseUs from './components/WhyChooseUs.jsx'
import SpecialOffer from './components/SpecialOffer.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  useEffect(() => {
    initSmoothScroll()
  }, [])
  useK95Effects()

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Bỏ qua đến nội dung</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Locations />
        <Portfolio />
        <BridalCollection />
        <WhyChooseUs />
        <SpecialOffer />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <Cursor />
    </MotionConfig>
  )
}
