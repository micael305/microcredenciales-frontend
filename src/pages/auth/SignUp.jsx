import { useState } from "react";
import { supabase } from "../../supabase/Client";
import { useNavigate } from 'react-router-dom';
import "./auth.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await supabase.auth.signUp({email, password});
      if(!result.error) alert("Revisa tu correo para confirmar la cuenta");
    } catch (error) {
      console.log("Error al registrarse: ", error.message);
    }
  };

  return (
    <div className="page-container">
      <main className="main-content-centered">
        <div className="auth-card">
            <h2 className="auth-title">Crear Cuenta</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                 <label className="form-label">Email</label>
                 <input 
                    type="email" 
                    placeholder="Email" 
                    className="form-input"
                    onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    className="form-input"
                    onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              
              <button type="submit" className="btn-secondary">
                Registrarse
              </button>
            </form>

            <button onClick={() => navigate('/')} className="btn-link">
                ← Volver al inicio
            </button>
        </div>
      </main>
    </div>
  )
}

export default SignUp;