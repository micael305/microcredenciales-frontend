import "./startCard.css";

function StartCard({ number, label, color }) {
  const variantClass = color === 'orange'
    ? 'stat-card--warning'
    : 'stat-card--primary';

  return (
    <div className={`stat-card ${variantClass}`}>
      <div className="stat-card__number">{number}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

export default StartCard;
