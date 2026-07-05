import React, { useRef, useState } from 'react';
import { MdClose, MdDownload } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import './DiplomaModal.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DiplomaModal({ credential, onClose }) {
  const diplomaRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!credential) return null;

  const handleDownload = async () => {
    if (!diplomaRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(diplomaRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: null
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `diploma_${credential.credential_hash || 'demo'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating diploma image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // We construct the verification URL the QR code will point to
  const verifyUrl = `${window.location.origin}/verificar/${credential.credential_hash}`;

  // Formatting date similar to Moodle
  const formattedDate = formatDate(credential.completion_date);

  // For the thesis, we hardcode anonymous data as requested.
  const studentName = "Juan Pérez";
  const studentDni = "XX.XXX.XXX";

  return (
    <div className="diploma-scrim" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div
        className="diploma-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diploma-title"
      >
        <button className="diploma-close-btn" onClick={onClose} aria-label="Cerrar">
          <MdClose />
        </button>

        <div className="md3-certificate-illustration" ref={diplomaRef}>
          <div className="cert-inner">
            <div className="cert-rings">
              <span className="cert-ring cert-ring--1"></span>
              <span class="cert-ring cert-ring--2"></span>
              <span class="cert-ring cert-ring--3"></span>
            </div>
            <div className="cert-content">
              <div className="cert-toprow">
                <span className="cert-eyebrow">Universidad Tecnológica Nacional - Facultad Regional Tucumán</span>
                <span className="cert-pill">Verificada en blockchain</span>
              </div>

              <div className="cert-main">
                <div className="cert-badge"></div>
                <div className="cert-maintext">
                  <p className="cert-kicker">Certifica que</p>
                  <h2 className="cert-name" id="diploma-title">{studentName}</h2>
                  <p className="cert-dni">DNI {studentDni}</p>
                  <p className="cert-desc">Aprobó <strong>{credential.course_name}</strong></p>
                  <p className="cert-meta">{formattedDate} · 120 horas reloj · Universidad Tecnológica Nacional - Facultad Regional Tucumán</p>
                </div>
              </div>

              <div className="cert-bottom">
                <div className="cert-bottom-left">
                  <div className="cert-divider"></div>
                  <span className="cert-domain">portal-credenciales.utnpf.site</span>
                  <span className="cert-foot">Verificación pública · Hyperledger Besu</span>
                  <span className="cert-disclaimer" style={{ display: 'block', marginTop: '1cqw', fontSize: '1.1cqw', color: 'rgba(255, 255, 255, 0.4)', maxWidth: '90%' }}>
                    * Documento emitido con fines demostrativos. Los datos personales aquí reflejados 
                    corresponden al usuario actual de la plataforma a modo de ejemplo ilustrativo 
                    para la visualización de la interfaz gráfica y de integración blockchain.
                  </span>
                </div>
                <div className="cert-qr-card">
                  <a href={verifyUrl} target="_blank" rel="noopener noreferrer" title="Verificar autenticidad">
                    <span className="cert-verify-qr" aria-label="QR de verificación pública">
                      <QRCodeSVG value={verifyUrl} size={90} level="M" includeMargin={false} />
                    </span>
                  </a>
                  <span className="cert-qr-cap">Escaneá para verificar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Download Button */}
        <div className="diploma-download-btn-container">
          <button 
            className="diploma-download-btn" 
            onClick={handleDownload} 
            disabled={isDownloading}
          >
            <MdDownload style={{ marginRight: '8px', fontSize: '1.2rem' }} />
            {isDownloading ? 'Generando...' : 'Descargar Diploma'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiplomaModal;
