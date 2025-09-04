import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home";
import ListarClientes from "./ListarClientes";
import AdicionarCliente from "./AdicionarCliente";
import EditarCliente from "./EditarCliente";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ListarClientes />} />
        <Route path="/adicionar" element={<AdicionarCliente />} />
        <Route path="/editar/:id" element={<EditarCliente />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
