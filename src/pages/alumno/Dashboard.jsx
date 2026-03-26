import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import StartCard from "../../components/StartCard/StartCard";
import CredentialCard from "../../components/CredentialCard/CredentialCard";
import CredentialModal from "../../components/CredentialModal/CredentialModal";
import "./alumno.css";

function Dashboard() {
  const [selectedCredential, setSelectedCredential] = useState(null);

  const mockCredentials = [
  {
    id: "cred-001",
    title: "Introducción a la Programación con Python",
    description: "Certifica el dominio de los fundamentos de programación estructurada y orientada a objetos usando Python para la resolución de problemas algorítmicos.",
    issuer: "UTN-FRT",
    department: "Dpto. de Informática",
    issueDate: "15/05/2024",
    status: "Activa",
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
  },
  {
    id: "cred-002",
    title: "Desarrollo Frontend con React",
    description: "Acredita la capacidad de crear interfaces de usuario dinámicas, interactuando con APIs y gestionando estados complejos con React.",
    issuer: "UTN-FRT",
    department: "Dpto. de Sistemas",
    issueDate: "20/07/2024",
    status: "Activa",
    hash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c"
  },
  {
    id: "cred-003",
    title: "Análisis de Sistemas I",
    description: "Certifica la aprobación de la cursada, incluyendo el relevamiento, análisis y modelado de requerimientos de software.",
    issuer: "UTN-FRT",
    department: "Dpto. de Sistemas",
    issueDate: "01/12/2023",
    status: "Activa",
    hash: "0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d"
  },
  {
    id: "cred-004",
    title: "Fundamentos de Blockchain",
    description: "Acredita el conocimiento de los principios criptográficos, redes descentralizadas y la arquitectura básica de las cadenas de bloques.",
    issuer: "UTN-FRT",
    department: "Secretaría de Extensión",
    issueDate: "05/06/2024",
    status: "Activa",
    hash: "0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b"
  }
];
  
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
      {mockCredentials.map((cred) => (
          <CredentialCard 
            key={cred.id} 
            title={cred.title}
            issuer={cred.issuer}
            issueDate={cred.issueDate}
            status={cred.status}
            onViewDetails={() => setSelectedCredential(cred)} 
          />
        ))}
      
      </div>
      <Footer />
      <CredentialModal 
        credential={selectedCredential} 
        onClose={() => setSelectedCredential(null)} 
      />
    </div>
  );
}

export default Dashboard;