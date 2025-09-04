import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdicionarCliente() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [uf, setUf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(""), 3000);
  };

  const showError = (msg) => {
    setErro(msg);
    setTimeout(() => setErro(""), 3000);
  };

  const validarFormulario = () => {
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) {
      showError("⚠️ Nome deve conter apenas letras e espaços.");
      return false;
    }
    if (isNaN(idade) || idade <= 0) {
      showError("⚠️ Idade deve ser um número maior que 0.");
      return false;
    }
    if (!/^[A-Za-z]{2}$/.test(uf)) {
      showError("⚠️ UF deve ter exatamente 2 letras (ex: RJ, SP).");
      return false;
    }
    return true;
  };

  const handleAddCliente = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    fetch("http://localhost:3000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Nome: nome, Idade: parseInt(idade), UF: uf.toUpperCase() }),
    })
      .then((res) => res.json())
      .then(() => {
        setNome("");
        setIdade("");
        setUf("");
        showMessage("✅ Cliente adicionado com sucesso!");
        setTimeout(() => navigate("/"), 1500); // 🔥 redireciona após 1.5s
      });
  };

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>➕ Adicionar Cliente</h2>

        {mensagem && (
          <div style={{ background: "#d1e7dd", color: "#0f5132", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center" }}>
            {mensagem}
          </div>
        )}
        {erro && (
          <div style={{ background: "#f8d7da", color: "#842029", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center" }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleAddCliente} style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "15px"
        }}>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required style={{
            padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px"
          }} />
          <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} required style={{
            padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px"
          }} />
          <input type="text" placeholder="UF (ex: SP)" maxLength="2" value={uf} onChange={(e) => setUf(e.target.value)} required style={{
            padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", textTransform: "uppercase"
          }} />

          <button type="submit" style={{
            padding: "12px",
            background: "#198754",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
          }}>➕ Adicionar</button>
        </form>

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

export default AdicionarCliente;
