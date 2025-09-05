import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar listener de evento
    window.addEventListener('resize', checkIfMobile);

    // Limpeza
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
}
