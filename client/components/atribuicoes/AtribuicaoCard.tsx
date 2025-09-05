import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Atribuicao, atualizarAtribuicao, excluirAtribuicao, getUsuarioAtual } from '@/services/api';
import { CalendarClock, Check, Clock, Edit, Trash2, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

interface AtribuicaoCardProps {
  atribuicao: Atribuicao;
  onUpdate: () => void;
}

export function AtribuicaoCard({ atribuicao, onUpdate }: AtribuicaoCardProps) {
  const usuario = getUsuarioAtual();
  const isBolsista = usuario?.tipo_usuario === 'bolsista';
  const isResponsavelOuAdmin = usuario?.tipo_usuario === 'responsavel' || usuario?.tipo_usuario === 'admin';
  
  const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-800',
    em_andamento: 'bg-blue-100 text-blue-800',
    concluida: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800',
  };
  
  const statusLabels = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
  };
  
  async function handleAtualizarStatus(novoStatus: Atribuicao['status']) {
    try {
      await atualizarAtribuicao(atribuicao.id, { status: novoStatus });
      toast({
        title: "Status atualizado",
        description: `Status atualizado para ${statusLabels[novoStatus]}`,
      });
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }
  
  async function handleExcluir() {
    try {
      await excluirAtribuicao(atribuicao.id);
      toast({
        title: "Atribuição excluída",
        description: "A atribuição foi excluída com sucesso",
      });
      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir atribuição:", error);
    }
  }
  
  const formatarData = (dataString: string | null) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{atribuicao.titulo}</CardTitle>
          <Badge className={statusColors[atribuicao.status]}>
            {statusLabels[atribuicao.status]}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 mt-2">
          <CalendarClock className="h-4 w-4" /> 
          Criado em: {formatarData(atribuicao.data_criacao)}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-700 whitespace-pre-line">{atribuicao.descricao}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Bolsista:</span>
            <p className="font-medium">{atribuicao.bolsista_nome}</p>
          </div>
          
          {atribuicao.responsavel_nome && (
            <div>
              <span className="text-muted-foreground">Responsável:</span>
              <p className="font-medium">{atribuicao.responsavel_nome}</p>
            </div>
          )}
          
          {atribuicao.data_conclusao && (
            <div className="col-span-2">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Concluído em:
              </span>
              <p className="font-medium">{formatarData(atribuicao.data_conclusao)}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isBolsista && (
          <div className="flex gap-2">
            {atribuicao.status === 'pendente' && (
              <Button variant="outline" size="sm" onClick={() => handleAtualizarStatus('em_andamento')}>
                <Clock className="mr-1 h-4 w-4" /> Iniciar
              </Button>
            )}
            
            {atribuicao.status === 'em_andamento' && (
              <Button variant="outline" size="sm" className="text-green-600" onClick={() => handleAtualizarStatus('concluida')}>
                <Check className="mr-1 h-4 w-4" /> Concluir
              </Button>
            )}
          </div>
        )}
        
        {isResponsavelOuAdmin && (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1 h-4 w-4" /> Editar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Atribuição</DialogTitle>
                  <DialogDescription>
                    Essa funcionalidade será implementada em breve.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => onUpdate()}>Fechar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente esta atribuição.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExcluir} className="bg-red-600 hover:bg-red-700">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {atribuicao.status !== 'cancelada' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600"
                onClick={() => handleAtualizarStatus('cancelada')}
              >
                <XCircle className="mr-1 h-4 w-4" /> Cancelar
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
