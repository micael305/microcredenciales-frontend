import './App.css'
import {Routes, Route} from 'react-router-dom'
import NotFound from './pages/NotFound.jsx'
//Vistas de autenticacion
import Login from './pages/auth/Login.jsx'
import SignUp from './pages/auth/SignUp.jsx' 
import Home from './pages/auth/Home.jsx'


function App() {
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
