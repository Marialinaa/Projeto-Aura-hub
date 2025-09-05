import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import BolsistaDashboard from "./pages/BolsistaDashboard";
import ResponsavelDashboard from "./pages/ResponsavelDashboard";
import TesteComponents from "./pages/TesteComponents";
import TesteAdminOriginal from "./pages/TesteAdminOriginal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bolsista" element={<BolsistaDashboard />} />
          <Route path="/responsavel" element={<ResponsavelDashboard />} />
          <Route path="/teste" element={<TesteComponents />} />
          <Route path="/teste-admin" element={<TesteAdminOriginal />} />
          {/* Backward compatibility */}
         
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
