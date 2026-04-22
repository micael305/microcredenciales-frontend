import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// Auth views
import Login from './pages/auth/Login.jsx'
import SetPassword from './pages/auth/SetPassword.jsx'
import Home from './pages/auth/Home.jsx'

// Student views
import Dashboard from './pages/alumno/Dashboard.jsx'

// Public verification
import VerificacionPublica from './pages/VerificacionPublica/VerificacionPublica.jsx'

// Not Found
import NotFound from './pages/NotFound.jsx'

function MoodleCallback() {
  const { loginWithMoodleToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Token no proporcionado. Accede desde Moodle para autenticarte.');
      return;
    }

    loginWithMoodleToken(token)
      .then((data) => {
        const dest = data.student.has_password ? '/alumno' : '/configurar-password';
        navigate(dest, { replace: true });
      })
      .catch((err) => setError(err.message || 'Error al autenticar con Moodle'));
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--md-sys-color-on-surface)' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
        <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
          Ir al Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--md-sys-color-on-surface-variant)' }}>
      <p style={{ fontSize: '1.1rem' }}>Autenticando desde Moodle...</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/auth/moodle-callback' element={<MoodleCallback />} />
      <Route path='/alumno' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/configurar-password' element={<ProtectedRoute><SetPassword /></ProtectedRoute>} />
      <Route path='/verificar' element={<VerificacionPublica />} />
      <Route path='/verificar/:hash' element={<VerificacionPublica />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
