import { useState } from 'react';
import '../styles/public-notice.css';

const WHATSAPP_LINK = `https://wa.me/916380816041?text=${encodeURIComponent(
  'Hello, I had made a payment to Babu (former trainer). I want to report it.'
)}`;

const points = [
  'While working as a trainer at Rising Sun Fitness, Babu collected money from members in the owner\'s name — personal training advances and supplement payments.',
  'He did not hand this money over to the gym and left without delivering the training or supplements. He has been removed and blacklisted.',
  'Babu is no longer associated with Rising Sun Fitness in any capacity and is NOT authorised to collect any money on its behalf.',
  'Any payment made to him personally is not recognised by the gym. Pay only at the gym counter and always ask for a receipt.',
];

export default function PublicNotice() {
  // Tap toggles colour on touch devices; desktop uses CSS :hover
  const [showColor, setShowColor] = useState(false);

  return (
    <section className="public-notice" id="public-notice">
      <div className="pn-inner">
        <div
          className={`pn-photo-wrap${showColor ? ' is-color' : ''}`}
          onClick={() => setShowColor((v) => !v)}
        >
          <img className="pn-photo" src="/babu.jpg" alt="Babu — former trainer, blacklisted" />
          <div className="pn-stamp">BLACKLISTED</div>
        </div>

        <div className="pn-body">
          <div className="pn-label">⚠ Public Notice — Fraud Alert</div>
          <h2 className="pn-title">
            <span className="pn-highlight">BLACKLISTED</span>
          </h2>
          <div className="pn-subject">Former Trainer: <span>Babu</span></div>

          <ul className="pn-list">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          <p className="pn-cta-text">
            Have you given money to Babu for training, supplements or membership? Tell us so we can record it.
          </p>
          <a className="pn-btn" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            REPORT A PAYMENT →
          </a>
          <div className="pn-phone">or call +91 63808 16041</div>
        </div>
      </div>
    </section>
  );
}
