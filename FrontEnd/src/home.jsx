import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // centraliza horizontal
        alignItems: "center",     // centraliza vertical
        height: "100vh",
        background: "#f4f6f9",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1 style={{ color: "#0d6efd" }}>📊 Gerenciador de Clientes</h1>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/clientes">
            <button
              style={{
                padding: "15px 30px",
                fontSize: "18px",
                background: "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              📋 Listar Clientes
            </button>
          </Link>

          <Link to="/adicionar">
            <button
              style={{
                padding: "15px 30px",
                fontSize: "18px",
                background: "#198754",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ➕ Adicionar Cliente
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
