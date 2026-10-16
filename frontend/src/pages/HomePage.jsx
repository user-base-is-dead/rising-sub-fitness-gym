import Hero from '../components/Hero';
import Manifesto from '../components/Manifesto';
import About from '../components/About';
import Services from '../components/Services';
import Trainers from '../components/Trainers';
import Gallery from '../components/Gallery';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SectionMarquee from '../components/SectionMarquee';

export default function HomePage({ loaded }) {
  return (
    <>
      <Hero loaded={loaded} />

      <SectionMarquee text="DISCIPLINE • STRENGTH • POWER • DEDICATION • GRIND • FOCUS" baseDirection={1} />

      <Manifesto />

      <About />

      <SectionMarquee text="YOGA • PERSONAL TRAINING • CARDIO • BODYBUILDING • FITNESS" baseDirection={-1} />

      <Services />

      <Trainers />

      <Gallery />

      <SectionMarquee text="₹800/MONTH • JOIN NOW • TRANSFORM YOUR BODY • NO EXCUSES" baseDirection={1} />

      <Pricing />

      <Contact />

      <Footer />
    </>
  );
}
