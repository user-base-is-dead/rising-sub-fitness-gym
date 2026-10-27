import { useEffect } from 'react';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import PublicNotice from '../components/PublicNotice';
import SectionMarquee from '../components/SectionMarquee';
import '../styles/home-bold.css';
import '../styles/blacklist-page.css';

export default function BlacklistPage() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blacklist-page home-bold">
      <PageHero
        tone="alert"
        compact
        ghost="WARNING"
        eyebrow="Public Notice — Stay Alert"
        title={<>Black<em>list</em></>}
        tagline="The people listed here have been banned from Rising Sun Fitness for fraud, misconduct or breaking gym rules — from taking members' money and never returning it to misbehaving with members. They have no connection with the gym and are not authorised to collect any money on its behalf. Pay only at the gym counter and always ask for a receipt."
      />

      <SectionMarquee text="PAY ONLY AT THE GYM COUNTER • ALWAYS ASK FOR A RECEIPT • DO NOT PAY ANYONE PERSONALLY" baseDirection={1} variant="alert" />

      <PublicNotice />

      <Footer />
    </div>
  );
}
