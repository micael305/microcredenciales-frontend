import { useState } from "react";
import { supabase } from "../../supabase/Client.js";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./auth.css"; 

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) {
        alert("Error: " + error.message);
        return;
      }
      if (data.user) navigate('/alumno'); 
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <main className="main-content-centered">
        <div className="auth-card">
            <button className="btn-link" onClick={() => navigate('/')}>&lt;   Volver</button>
            <h2 className="auth-title">Acceso Alumno</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group"> 
                    <label className="form-label">Email</label>
                    <input 
                        required
                        type="text"
                        placeholder="emailejemplo@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input 
                        required
                        type="password"
                        placeholder="••••••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? "Cargando..." : "Entrar al Portal"}
                </button>
            </form>

            <div className="auth-footer">
                <span>¿No tienes una cuenta? </span>
                <button className="btn-link" onClick={() => navigate('/signup')}>Regístrate</button>
            </div>
   
        </div>
      </main>

      <Footer/>
    </div>
  );
}

export default Login;