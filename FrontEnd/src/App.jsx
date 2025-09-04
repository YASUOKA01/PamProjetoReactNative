import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./home";
import ListarClientes from "./ListarClientes";
import AdicionarCliente from "./AdicionarCliente";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* HEADER */}
        <header
          style={{
            background: "#0d6efd",
            color: "white",
            padding: "20px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          📊 Gerenciador de Clientes
        </header>

        {/* NAVi bosta*/}
{/* NAVi bosta*/}
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            padding: "15px",
            background: "#e9ecef",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#0d6efd", fontWeight: "bold" }}>🏠 Home</Link>
          <Link to="/clientes" style={{ textDecoration: "none", color: "#0d6efd", fontWeight: "bold" }}>📋 Listar</Link>
          <Link to="/adicionar" style={{ textDecoration: "none", color: "#0d6efd", fontWeight: "bold" }}>➕ Adicionar</Link>
        </nav>

        {/* MAIN CENTRALIZADO */}
        <main
          style={{
            flex: 1,                        
            display: "flex",
            justifyContent: "center",      
            alignItems: "center",          
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<ListarClientes />} />
            <Route path="/adicionar" element={<AdicionarCliente />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
