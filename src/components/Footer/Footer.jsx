import './footer.css';

function Footer() {
  const explorerUrl = import.meta.env.VITE_EXPLORER_URL || '';

  return (
    <footer className="footer">
      <div className="footer-container">
        <span className="footer-text">
          Portal de Microcredenciales · UTN Facultad Regional Tucumán
        </span>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Blockchain Explorer ↗
          </a>
        )}
      </div>
    </footer>
  );
}

export default Footer;