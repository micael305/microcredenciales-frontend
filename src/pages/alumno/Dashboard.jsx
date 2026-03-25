import Header from "../../components/Header/Header";
import StartCard from "../../components/StartCard/StartCard";
import CredentialCard from "../../components/CredentialCard/CredentialCard";
import Footer from "../../components/Footer/Footer";
import "./alumno.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
        <Header />
      <div className="dashboard-header">
          <h1>Bienvenido, Micael Abdias Rodriguez</h1>
          <h3>Gestiona y comparte tus logros académicos de forma segura.</h3>
          <hr className="header-divider" />
        </div>

      <div className="starcard-container">
      <StartCard number="10" />
      <StartCard number="10" color="orange" />
      </div>

      <h4 className="credentialcard-title">Mis Microcredenciales</h4>
      <div className="credentialcard-container">
      <CredentialCard 
        title="Introducción a la Programación con Python"
        issuer="UTN-FRT"
        issueDate="15/05/2024"
        status="Activa"
      />
        <CredentialCard 
        title="Introducción a la Programación con Python"
        issuer="UTN-FRT"
        issueDate="15/05/2024"
        status="Activa"
      />
        <CredentialCard 
        title="Introducción a la Programación con Python"
        issuer="UTN-FRT"
        issueDate="15/05/2024"
        status="Activa"
      />
        <CredentialCard 
        title="Introducción a la Programación con Python"
        issuer="UTN-FRT"
        issueDate="15/05/2024"
        status="Activa"
      />
      
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;