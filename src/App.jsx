import {Routes, Route, useNavigate} from 'react-router-dom'
import { useEffect } from "react";
import './App.css';
import {supabase} from './supabase/Client.js'

//Vistas de autenticacion
import Login from './pages/auth/Login.jsx'
import SignUp from './pages/auth/SignUp.jsx' 
import Home from './pages/auth/Home.jsx'
//Not Found
import NotFound from './pages/NotFound.jsx'

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if(!session){
        navigate('/login');
        console.log("no hay sesion");
      }else{
        navigate('*');
        console.log("hay sesion");
      }
    })
  }, []);
  return (
    <Routes>
      <Route  path='/' element={<Home/>}/>
      <Route  path='/login' element={<Login/>}/>
      <Route  path='/signup' element={<SignUp/>}/>
      <Route  path='*' element={<NotFound/>}/>
    </Routes>
  )
}

export default App
