import { useToast } from "@/hooks/use-toast";

// Re-export do hook
export { useToast };

// Função helper legacy: aceita objeto com title/description/variant
type ToastOptions = { title?: string; description?: string; variant?: string };
export const toast = (opts: ToastOptions) => {
  // fallback simples que usa console.log para não quebrar durante build
  if (!opts) return;
  console.info("toast:", opts.title, opts.description, opts.variant);
  // se estiver em runtime com hook, recomende o hook
  try {
    // noop: o hook deve ser usado dentro de componentes
  } catch (e) {
    // ignore
  }
};
