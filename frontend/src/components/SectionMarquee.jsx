
export default function SectionMarquee({ text }) {
  return (
    <div className="section-divider-marquee">
      <div className="marquee-track">
        {[...Array(6)].map((_, i) => (
          <span className="marquee-item" key={i}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
