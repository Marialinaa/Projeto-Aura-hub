import axios from "axios";
import type { RegistrationData, ApiResponse, User } from "@shared/types";

// Configurar URL base da API
const BASE_URL = "/api"; // Use relative path to Express server

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: (
    data: RegistrationData,
  ): Promise<{ data: ApiResponse<User>; status: number }> => {
    console.log("Enviando para:", `${BASE_URL}/register`, data);
    return api.post("/register", data);
  },
  login: (
    email: string,
    password: string,
  ): Promise<{
    data: ApiResponse<{ token: string; user: User }>;
    status: number;
  }> => {
    return api.post("/login", { email, password });
  },
};

export const usuarioService = {
  listar: () => api.get("/users"),

  aprovar: (id: number) => api.put("/users", { id, acao: "aprovar" }),

  rejeitar: (id: number) => api.put("/users", { id, acao: "rejeitar" }),
};

export const uploadService = {
  enviar: (formData: FormData) =>
    api.post("/upload.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  listar: () => api.get("/upload.php"),
};

export const profileService = {
  meusUploads: () => api.get("/meus-uploads.php"),

  excluirUpload: (id: number) => api.delete(`/delete-upload.php?id=${id}`),
};

export const galleryService = {
  listar: (page = 1, limit = 20) =>
    api.get(`/gallery.php?page=${page}&limit=${limit}`),
};

export const notificationService = {
  listar: () => api.get("/notifications.php"),

  marcarComoLida: (id: number) =>
    api.post("/mark-notification-read.php", { id }),

  marcarTodasComoLidas: () => api.post("/mark-all-notifications-read.php"),

  excluir: (id: number) => api.delete(`/delete-notification.php?id=${id}`),
};

export const settingsService = {
  buscar: () => api.get("/settings.php"),

  atualizar: (settings: any) => api.put("/settings.php", { settings }),

  exportarDados: () => api.get("/export-data.php"),
};

export const userService = {
  perfil: () => api.get("/user-profile.php"),

  atualizarPerfil: (dados: any) => api.put("/user-profile.php", dados),

  alterarSenha: (senhas: any) => api.put("/change-password.php", senhas),
};

export const xptoService = {
  criar: (formData: FormData) =>
    api.post("/xpto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  listar: () => api.get("/xpto"),

  obterFoto: (id: number) => api.get(`/xpto/${id}/foto`, {
    responseType: 'blob'
  }),

  excluir: (id: number) => api.delete(`/xpto/${id}`),
};
