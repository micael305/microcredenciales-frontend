import "./startCard.css";

function StartCard({ number, label, color = 'primary' }) {
  const variantClass = `stat-card--${color}`;

  return (
    <div className={`stat-card ${variantClass}`}>
      <div className="stat-card__number">{number}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

export default StartCard;
