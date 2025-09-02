import axios from "axios";

// Define a URL base da API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Configuração do cliente axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token de autenticação a todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error);

    if (error.response) {
      console.error("Detalhes da resposta:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("Nenhuma resposta recebida:", error.request);
    }

    return Promise.reject(error);
  }
);

// ---------------------------
// Serviços
// ---------------------------

// Serviço de usuários
export const usuarioService = {
  listar: () => api.get("/usuarios"),
  aprovar: (id: number) => api.put(`/usuarios/${id}/aprovar`),
  rejeitar: (id: number) => api.put(`/usuarios/${id}/rejeitar`),
  verificarStatus: () => api.get("/status"),
};

// Serviço de notificações
export const notificationService = {
  listar: () => api.get("/notifications.php"),
  marcarComoLida: (id: number) => api.post("/mark-notification-read.php", { id }),
  marcarTodasComoLidas: () => api.post("/mark-all-notifications-read.php"),
  excluir: (id: number) => api.delete(`/delete-notification.php?id=${id}`),
};

// Serviço de configurações
export const settingsService = {
  buscar: () => api.get("/settings.php"),
  atualizar: (settings: any) => api.put("/settings.php", { settings }),
  exportarDados: () => api.get("/export-data.php"),
};

// Serviço de usuário logado
export const userService = {
  perfil: () => api.get("/user-profile.php"),
  atualizarPerfil: (dados: any) => api.put("/user-profile.php", dados),
  alterarSenha: (senhas: any) => api.put("/change-password.php", senhas),
};

// Serviço XPTO (exemplo extra)
export const xptoService = {
  criar: (formData: FormData) =>
    api.post("/xpto", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  listar: () => api.get("/xpto"),
  obterFoto: (id: number) =>
    api.get(`/xpto/${id}/foto`, { responseType: "blob" }),
  excluir: (id: number) => api.delete(`/xpto/${id}`),
};

export default api;
