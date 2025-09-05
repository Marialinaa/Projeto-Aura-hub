import React from 'react';
// Re-exportando os ícones mais usados
import { 
  Check, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Filter, 
  Mail, 
  Save, 
  Shield, 
  Trash2, 
  User, 
  UserCheck, 
  UserX, 
  Users, 
  X, 
  XCircle 
} from 'lucide-react';

export {
  Check, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Filter, 
  Mail, 
  Save, 
  Shield, 
  Trash2, 
  User, 
  UserCheck, 
  UserX, 
  Users, 
  X, 
  XCircle
};

// Componente de ícone personalizado para fallback
export const IconFallback: React.FC<{ name: string }> = ({ name }) => {
  return <span className="text-xs opacity-70">{name}</span>;
};
