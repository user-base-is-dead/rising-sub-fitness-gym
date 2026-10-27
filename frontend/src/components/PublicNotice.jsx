import { useState } from 'react';
import '../styles/public-notice.css';

const points = [
  {
    title: 'Vulgar and indecent behaviour towards female members',
    text: 'Female members complained that Babu behaved with them in a vulgar, indecent and disrespectful way. His attitude towards women was dirty and degrading, and it made them feel unsafe and uncomfortable at the gym.',
    highlight: true,
  },
  {
    title: 'Misbehaved with members',
    text: 'He was rude and disrespectful to members in general, men and women alike.',
  },
  {
    title: 'Borrowed money and never repaid',
    text: 'He asked several members to lend him money as a personal loan, took it, and never paid it back.',
  },
  {
    title: 'Took supplement money and did not deliver',
    text: 'He collected advance payments from members for supplements (around ₹10,000 to ₹12,000 from some of them), then never supplied the products or returned the money.',
  },
  {
    title: 'Ran away with members\' money',
    text: 'After collecting money from several members, he left without repaying anyone. None of this money ever reached the gym.',
  },
  {
    title: 'Permanently banned',
    text: 'Babu has been removed and blacklisted. He may not work here as a trainer, and he is not allowed to enter the Rising Sun Fitness premises at all.',
  },
  {
    title: 'Not authorised to collect money',
    text: 'Any payment made to him personally is not recognised by the gym. Pay only at the gym counter and always ask for a receipt.',
  },
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
          <div className="pn-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4.5M12 17.2v.3" strokeLinecap="round" />
            </svg>
            Public Notice — Fraud Alert
          </div>
          <h2 className="pn-title">
            <span className="pn-highlight">BLACKLISTED</span>
          </h2>
          <div className="pn-subject">Former Trainer: <span>Babu</span></div>

          <ul className="pn-list">
            {points.map((p, i) => (
              <li key={i} className={p.highlight ? 'is-highlight' : undefined}>
                <strong>{p.title}</strong> {p.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
