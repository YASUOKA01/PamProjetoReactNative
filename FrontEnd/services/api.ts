import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // use localhost se estiver no mesmo PC
});

export default api;
