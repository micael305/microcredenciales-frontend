import {Routes, Route, useNavigate} from 'react-router-dom'
import { useEffect } from "react";
import './App.css';
import {supabase} from './supabase/Client.js'

//Vistas de autenticacion
import Login from './pages/auth/Login.jsx'
import SignUp from './pages/auth/SignUp.jsx' 
import Home from './pages/auth/Home.jsx'

//Vistas de alumno
import Alumno from './pages/alumno/Dashboard.jsx'

//Vista de verificacion publica
import VerificacionPublica from './pages/VerificacionPublica/VerificacionPublica.jsx'

//Not Found
import NotFound from './pages/NotFound.jsx'

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const publicRoutes = ['/', '/login', '/signup'];
      const isPublicRoute = publicRoutes.includes(window.location.pathname);

      if (event === 'SIGNED_IN') {
        navigate('/alumno');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (!session && !isPublicRoute) {
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route  path='/' element={<Home/>}/>
      <Route  path='/login' element={<Login/>}/>
      <Route  path='/signup' element={<SignUp/>}/>
      <Route  path='/alumno' element={<Alumno/>}/>
      <Route path="/verificar/:id" element={<VerificacionPublica />} />
      <Route  path='*' element={<NotFound/>}/>
    </Routes>
  )
}

export default App
