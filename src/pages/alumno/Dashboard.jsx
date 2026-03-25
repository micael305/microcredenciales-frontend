import Header from "../../components/Header/Header";
import StartCard from "../../components/StartCard/StartCard";
import "./alumno.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
        <Header />
      <h1>Bienvenido, [Nombre del Alumno]</h1>
      <h3>Gestiona y comparte tus logros académicos de forma segura.</h3>
      <div className="starcard-container">
      <StartCard number="10" />
      <StartCard number="10" color="orange" />
      </div>
    </div>
  );
}

export default Dashboard;