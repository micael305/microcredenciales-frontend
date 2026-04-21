import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdOpenInNew } from 'react-icons/md';
import * as api from '../../api/client';
import {
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
  getBlockchainStatusDescription,
} from '../../utils/blockchain';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './VerificacionPublica.css';

function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
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
      setError(err.message || 'Error al verificar la credencial');
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

  const blockchain = result?.blockchain;
  const blockchainVariant = blockchain ? getBlockchainStatusVariant(blockchain.status) : null;

  return (
    <div className="verificacion-page">
      <Header />

      <div className="verificacion-container">
        <div
          className="verificacion-card"
          style={{ marginBottom: hash ? '0' : '0' }}
        >
          <h2 className="verificacion-title">Verificación Pública de Credenciales</h2>
          <p className="verificacion-text">
            Ingresá el hash de una credencial para consultar su estado en el
            registro institucional y en la blockchain.
          </p>
          <form onSubmit={handleSearch} className="verificacion-search-form" id="verification-form">
            <input
              type="text"
              placeholder="Pegar hash de la credencial..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="verificacion-search-input"
              id="verification-hash-input"
            />
            <button
              type="submit"
              className="verificacion-search-btn"
              disabled={loading}
              id="verification-submit-btn"
            >
              {loading ? 'Validando...' : 'Verificar'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="verificacion-card">
            <p className="verificacion-text">Validando credencial...</p>
          </div>
        )}

        {error && (
          <div className="verificacion-card">
            <div className="verificacion-icon verificacion-icon--error">✕</div>
            <p className="verificacion-text">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="verificacion-card">
            {result.valid ? (
              <>
                <div className="verificacion-icon">✓</div>
                <h2 className="verificacion-title">Credencial Reconocida</h2>
                <p className="verificacion-text">
                  Los datos coinciden con una emisión registrada por la institución.
                </p>

                <div className="verificacion-details">
                  {result.student_name && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Alumno</span>
                      <span className="verificacion-value">{result.student_name}</span>
                    </div>
                  )}
                  {result.course_name && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Curso</span>
                      <span className="verificacion-value">{result.course_name}</span>
                    </div>
                  )}
                  {result.completion_date && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Fecha de Emisión</span>
                      <span className="verificacion-value">
                        {formatDate(result.completion_date)}
                      </span>
                    </div>
                  )}
                  {result.issuer && (
                    <div className="verificacion-data">
                      <span className="verificacion-label">Institución Emisora</span>
                      <span className="verificacion-value">{result.issuer}</span>
                    </div>
                  )}

                  {blockchain && (
                    <>
                      <div className="verificacion-data">
                        <span className="verificacion-label">Red Blockchain</span>
                        <span className="verificacion-value">{blockchain.network}</span>
                      </div>
                      <div className="verificacion-data">
                        <span className="verificacion-label">Estado on-chain</span>
                        <span className={`verificacion-status-badge verificacion-status-badge--${blockchainVariant}`}>
                          {getBlockchainStatusLabel(blockchain.status)}
                        </span>
                      </div>
                      {blockchain.issuer_did && (
                        <div className="verificacion-data">
                          <span className="verificacion-label">DID del Emisor</span>
                          <span className="verificacion-value verificacion-hash">
                            {blockchain.issuer_did}
                          </span>
                        </div>
                      )}
                      {blockchain.txn_id && (
                        <div className="verificacion-data">
                          <span className="verificacion-label">Transaction ID</span>
                          <span className="verificacion-value verificacion-hash">
                            {blockchain.txn_id}
                          </span>
                        </div>
                      )}
                      {blockchain.explorer_url && (
                        <a
                          href={blockchain.explorer_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="verificacion-explorer-link"
                        >
                          <MdOpenInNew />
                          Ver en Blockchain Explorer
                        </a>
                      )}
                    </>
                  )}
                </div>

                {blockchain && (
                  <p className="verificacion-description">
                    {getBlockchainStatusDescription(blockchain.status)}
                  </p>
                )}

                <div className="verificacion-data" style={{ marginTop: '16px' }}>
                  <span className="verificacion-label">Hash de la Credencial</span>
                  <span className="verificacion-value verificacion-hash">
                    {result.credential_hash}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="verificacion-icon verificacion-icon--error">✕</div>
                <h2 className="verificacion-title">Credencial No Encontrada</h2>
                <p className="verificacion-text">
                  No se encontró ninguna credencial que corresponda al hash proporcionado.
                  Verificá que el hash sea correcto.
                </p>
                <div className="verificacion-data">
                  <span className="verificacion-label">Hash Consultado</span>
                  <span className="verificacion-value verificacion-hash">
                    {result.credential_hash}
                  </span>
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
