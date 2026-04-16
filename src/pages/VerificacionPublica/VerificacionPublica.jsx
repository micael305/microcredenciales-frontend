import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api/client';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './verificacionPublica.css';

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function VerificacionPublica() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [searchHash, setSearchHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hash) {
      verify(hash);
    }
  }, [hash]);

  const verify = async (hashToVerify) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.publicVerify(hashToVerify);
      setResult(data);
    } catch (err) {
      setError(err.message || "Error al verificar la credencial");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchHash.trim();
    if (!trimmed) return;
    navigate(`/verificar/${trimmed}`);
  };

  return (
    <div className="verificacion-page">
      <Header />

      <div className="verificacion-container">
        {/* Search form */}
        <div className="verificacion-card" style={{ marginBottom: hash ? '1.5rem' : '0' }}>
          <h2 className="verificacion-title">Verificación Pública de Credenciales</h2>
          <p className="verificacion-text">
            Ingresa el hash de una credencial para verificar su autenticidad en la blockchain.
          </p>
          <form onSubmit={handleSearch} className="verificacion-search-form">
            <input
              type="text"
              placeholder="Pegar hash de la credencial..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="verificacion-search-input"
            />
            <button type="submit" className="verificacion-search-btn" disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="verificacion-card">
            <p className="verificacion-text">Consultando blockchain...</p>
          </div>
        )}

        {error && (
          <div className="verificacion-card">
            <div className="verificacion-icon verificacion-icon--error">&#10060;</div>
            <p className="verificacion-text">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="verificacion-card">
            {result.valid ? (
              <>
                <div className="verificacion-icon">&#9989;</div>
                <h2 className="verificacion-title">Credencial Auténtica</h2>
                <p className="verificacion-text">
                  Se ha verificado criptográficamente la existencia e integridad de esta credencial.
                </p>

                <div className="verificacion-details">
                  {result.student_name && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Alumno:</span>
                      <span className="verificacion-value">{result.student_name}</span>
                    </div>
                  )}
                  {result.course_name && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Curso:</span>
                      <span className="verificacion-value">{result.course_name}</span>
                    </div>
                  )}
                  {result.completion_date && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Fecha de Emisión:</span>
                      <span className="verificacion-value">{formatDate(result.completion_date)}</span>
                    </div>
                  )}
                  {result.issuer && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Emisor:</span>
                      <span className="verificacion-value">{result.issuer}</span>
                    </div>
                  )}
                  <div className="verificacion-data">
                    <span className="verificacion-label">Blockchain:</span>
                    <span className="verificacion-value">
                      {result.blockchain_confirmed ? "Confirmado en Hyperledger Fabric" : "Verificado en base de datos"}
                    </span>
                  </div>
                </div>

                <div className="verificacion-data" style={{ marginTop: '1rem' }}>
                  <span className="verificacion-label">Hash:</span>
                  <span className="verificacion-value verificacion-hash">{result.credential_hash}</span>
                </div>
              </>
            ) : (
              <>
                <div className="verificacion-icon verificacion-icon--error">&#10060;</div>
                <h2 className="verificacion-title">Credencial No Encontrada</h2>
                <p className="verificacion-text">
                  No se encontró ninguna credencial que corresponda al hash proporcionado. Verifica que el hash sea correcto.
                </p>
                <div className="verificacion-data">
                  <span className="verificacion-label">Hash consultado:</span>
                  <span className="verificacion-value verificacion-hash">{result.credential_hash}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default VerificacionPublica;
