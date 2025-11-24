import { useState } from "react";
import {supabase} from "../../supabase/Client";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //no recargar la pagina
    try {
      const result = await supabase.auth.signInWithPassword({email: email, password: password});
      console.log(result);
    }catch (error) {
      console.log("Error al iniciar sesión: ", error.message);
    }
  };

  return (
    <>
    <button onClick={() => navigate('/')}>Volver</button>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="tuemail@email.com" 
        onChange={e => setEmail(e.target.value)}/>
        <input type="password" name="password" placeholder="tu contraseña"
        onChange={e => setPassword(e.target.value)}/>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login;