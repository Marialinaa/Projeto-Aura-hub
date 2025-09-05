import { useToast } from "@/hooks/use-toast";

// Re-export do hook
export { useToast };

// Para uso da função toast, recomenda-se usar o hook useToast dentro do componente
// Exemplo: const { toast } = useToast();
export const toast = (() => {
  console.warn("Use 'const { toast } = useToast()' dentro de um componente React");
  return () => ({ id: '', dismiss: () => {}, update: () => {} });
})();
