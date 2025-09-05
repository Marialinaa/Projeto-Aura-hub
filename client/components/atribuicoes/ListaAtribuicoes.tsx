import React, { useEffect, useState } from 'react';
import { Atribuicao, listarAtribuicoes, getUsuarioAtual } from '@/services/api';
import { AtribuicaoCard } from './AtribuicaoCard';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { NovaAtribuicaoForm } from './NovaAtribuicaoForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ListaAtribuicoes() {
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const usuario = getUsuarioAtual();
  
  const podeAdicionarAtribuicao = usuario?.tipo_usuario === 'admin' || usuario?.tipo_usuario === 'responsavel';
  
  async function carregarAtribuicoes() {
    setIsLoading(true);
    try {
      const filtros: Record<string, string> = {};
      
      if (filtroStatus !== 'todos') {
        filtros.status = filtroStatus;
      }
      
      const data = await listarAtribuicoes(filtros);
      setAtribuicoes(data);
    } catch (error) {
      console.error("Erro ao carregar atribuições:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    carregarAtribuicoes();
  }, [filtroStatus]);
  
  function handleDialogClose() {
    setIsDialogOpen(false);
  }
  
  function handleSuccess() {
    setIsDialogOpen(false);
    carregarAtribuicoes();
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Atribuições</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="filtro-status" className="whitespace-nowrap">Filtrar por:</Label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger id="filtro-status" className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluídas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={carregarAtribuicoes}>
              <RefreshCw className="mr-1 h-4 w-4" /> Atualizar
            </Button>
            
            {podeAdicionarAtribuicao && (
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-1 h-4 w-4" /> Nova Atribuição
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : atribuicoes.length === 0 ? (
        <div className="bg-muted py-8 px-4 rounded-lg text-center">
          <p className="text-muted-foreground">Nenhuma atribuição encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {atribuicoes.map(atribuicao => (
            <AtribuicaoCard 
              key={atribuicao.id} 
              atribuicao={atribuicao} 
              onUpdate={carregarAtribuicoes} 
            />
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <NovaAtribuicaoForm onSuccess={handleSuccess} onCancel={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
