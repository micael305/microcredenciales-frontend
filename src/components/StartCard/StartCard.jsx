import "./startcard.css";
function StartCard({number, label, color}) {
    const numberClassName = color === 'orange' ? 'start-card__number start-card__number--orange' : 'start-card__number';
    label = color === 'orange' ? label = 'Pendientes de Aceptación' : 'Credenciales Emitidas';  

  return (
    <div className="start-card">
      <div className={numberClassName}>{number}</div>
      <div className="start-card__label">{label}</div>
    </div>
  );
};

export default StartCard;
