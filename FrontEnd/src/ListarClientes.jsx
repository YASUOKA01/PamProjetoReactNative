import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ListarClientes() {
  const [clientes, setClientes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(""), 3000);
  };

  useEffect(() => {
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  const handleDelete = (id) => {
    const confirmar = window.confirm("❌ Deseja mesmo excluir esse cliente?");
    if (!confirmar) return;

    fetch(`http://localhost:3000/clientes/${id}`, { method: "DELETE" })
      .then(() => {
        setClientes(clientes.filter((c) => c.ID !== id));
        showMessage("🗑️ Cliente excluído com sucesso!");
      });
  };

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{
        width: "100%",
        maxWidth: "800px",
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>📋 Lista de Clientes</h2>

        {mensagem && (
          <div style={{
            background: "#d1e7dd",
            color: "#0f5132",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center"
          }}>
            {mensagem}
          </div>
        )}

        <div style={{ display: "grid", gap: "12px" }}>
          {clientes.map((cliente) => (
            <div key={cliente.ID} style={{
              background: "#fdfdfd",
              padding: "15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #eee"
            }}>
              <span style={{ fontSize: "16px" }}>
                <b>#{cliente.ID}</b> - {cliente.Nome} ({cliente.Idade} anos) - {cliente.UF}
              </span>
              <div>
                <Link to={`/editar/${cliente.ID}`}>
                  <button style={{
                    marginRight: "8px",
                    padding: "6px 12px",
                    background: "#0d6efd",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}>✏️ Editar</button>
                </Link>
                <button onClick={() => handleDelete(cliente.ID)} style={{
                  padding: "6px 12px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>🗑️ Excluir</button>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Voltar */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={() => navigate("/")} style={{
            padding: "10px 20px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            ⬅️ Voltar
          </button>
        </div>
      </div>
    </main>
  );
}

export default ListarClientes;
