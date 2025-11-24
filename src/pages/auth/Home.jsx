import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <>
        <div>
            <button onClick={() => navigate('/login')}>Iniciar Sesion</button>
            <button onClick={() => navigate('/signup')}>Registrarse</button>
        </div>
    </>
  );
}

export default Home;