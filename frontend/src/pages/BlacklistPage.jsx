import { useEffect } from 'react';
import Footer from '../components/Footer';
import PublicNotice from '../components/PublicNotice';
import '../styles/blacklist-page.css';

export default function BlacklistPage() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blacklist-page">
      {/* ── Hero Banner ── */}
      <section className="bl-hero">
        <div className="bl-hero-content">
          <div className="bl-hero-label">⚠ Public Notice — Protect Your Money</div>
          <h1 className="bl-hero-title">BLACK<span className="bl-red">LIST</span></h1>
          <div className="bl-hero-line" />
          <p className="bl-hero-text">
            The people listed here are no longer associated with Rising Sun Fitness and are not
            authorised to collect any money on its behalf. Pay only at the gym counter and always ask for a receipt.
          </p>
        </div>
      </section>

      <PublicNotice />

      <Footer />
    </div>
  );
}
