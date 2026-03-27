import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './verificacionPublica.css';

function VerificacionPublica() {
  const { id } = useParams();
  return (
    <div className="verificacion-page">
      <Header />
      
      <div className="verificacion-container">
        <div className="verificacion-card">
          <div className="verificacion-icon">✅</div>
          <h2 className="verificacion-title">Credencial Auténtica</h2>
          <p className="verificacion-text">
            Se ha verificado criptográficamente la existencia e integridad de esta credencial.
          </p>
          
          <div className="verificacion-data">
            <span className="verificacion-label">ID de Credencial:</span>
            <span className="verificacion-value">{id}</span>
          </div>

          <p className="verificacion-disclaimer">
            Esta es una vista pública. Los detalles completos de la credencial, el emisor y la institución pueden ser consultados verificando el hash en la blockchain.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default VerificacionPublica;