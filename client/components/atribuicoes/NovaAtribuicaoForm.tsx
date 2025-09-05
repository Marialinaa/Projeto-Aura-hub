import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Usuario, criarAtribuicao, listarUsuarios } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface NovaAtribuicaoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NovaAtribuicaoForm({ onSuccess, onCancel }: NovaAtribuicaoFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bolsistaId, setBolsistaId] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [bolsistas, setBolsistas] = useState<Usuario[]>([]);
  const [responsaveis, setResponsaveis] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const bolsistasData = await listarUsuarios('bolsista');
        const responsaveisData = await listarUsuarios('responsavel');
        
        setBolsistas(bolsistasData);
        setResponsaveis(responsaveisData);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    }
    
    carregarUsuarios();
  }, []);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!titulo || !descricao || !bolsistaId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await criarAtribuicao({
        titulo,
        descricao,
        bolsista_id: Number(bolsistaId),
        responsavel_id: responsavelId ? Number(responsavelId) : null,
        status: 'pendente'
      });
      
      toast({
        title: "Atribuição criada",
        description: "A atribuição foi criada com sucesso!",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar atribuição:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nova Atribuição</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input 
              id="titulo" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              placeholder="Título da atribuição"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os detalhes da atribuição"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bolsista">Bolsista</Label>
            <Select 
              value={bolsistaId} 
              onValueChange={setBolsistaId}
              required
            >
              <SelectTrigger id="bolsista">
                <SelectValue placeholder="Selecione um bolsista" />
              </SelectTrigger>
              <SelectContent>
                {bolsistas.map((bolsista) => (
                  <SelectItem key={bolsista.id} value={String(bolsista.id)}>
                    {bolsista.nome_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável (opcional)</Label>
            <Select 
              value={responsavelId} 
              onValueChange={setResponsavelId}
            >
              <SelectTrigger id="responsavel">
                <SelectValue placeholder="Selecione um responsável (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {responsaveis.map((responsavel) => (
                  <SelectItem key={responsavel.id} value={String(responsavel.id)}>
                    {responsavel.nome_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
