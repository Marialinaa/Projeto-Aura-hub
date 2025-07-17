import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { xptoService } from "@/services/api";

interface XptoItem {
  id: number;
  nome: string;
  descricao: string;
  foto_nome?: string;
  foto_tipo?: string;
  foto_tamanho?: number;
  tem_foto: boolean;
  data_criacao: string;
}

const Xpto: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    foto: null as File | null,
  });
  const [items, setItems] = useState<XptoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      const file = files ? files[0] : null;
      setFormData({ ...formData, foto: file });
      
      // Criar preview da imagem
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFotoPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('descricao', formData.descricao);
      if (formData.foto) {
        data.append('foto', formData.foto);
      }

      await xptoService.criar(data);
      
      // Limpar formulário
      setFormData({
        nome: "",
        descricao: "",
        foto: null,
      });
      setFotoPreview(null);
      
      // Recarregar lista
      await carregarItems();
      
      alert("Item criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar item:", error);
      alert("Erro ao criar item. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const carregarItems = async () => {
    setLoading(true);
    try {
      const response = await xptoService.listar();
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar items:", error);
    } finally {
      setLoading(false);
    }
  };

  const obterUrlFoto = (item: XptoItem) => {
    if (!item.tem_foto) return null;
    return `/api/xpto/${item.id}/foto`;
  };

  const excluirItem = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    
    try {
      await xptoService.excluir(id);
      await carregarItems();
      alert("Item excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      alert("Erro ao excluir item. Tente novamente.");
    }
  };

  const formatarTamanho = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString('pt-BR');
  };

  useEffect(() => {
    carregarItems();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-bold">XPTO</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome:</Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição:</Label>
          <Input
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="foto">Foto:</Label>
          <Input
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {fotoPreview && (
            <div className="mt-2">
              <img 
                src={fotoPreview} 
                alt="Preview" 
                className="max-w-xs max-h-48 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </Button>
      </form>

      {/* Lista de itens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Itens Cadastrados</h2>
          <Button onClick={carregarItems} variant="outline" size="sm">
            Atualizar
          </Button>
        </div>

        {loading ? (
          <p className="text-center py-4">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Nenhum item cadastrado</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.nome}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => excluirItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{item.descricao}</p>
                  
                  {item.tem_foto ? (
                    <div className="space-y-2">
                      <img
                        src={obterUrlFoto(item)}
                        alt={item.nome}
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ImageIcon className="h-3 w-3" />
                        <span>{item.foto_nome}</span>
                        <Badge variant="outline" className="text-xs">
                          {formatarTamanho(item.foto_tamanho)}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Sem foto</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Criado em: {formatarData(item.data_criacao)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Status da conexão */}
      <div className="mt-4 p-3 bg-green-50 rounded-md">
        <p className="text-sm text-green-700">
          ✅ Conectado ao MySQL - {items.length} item(s) encontrado(s)
        </p>
      </div>
    </div>
  );
};

export default Xpto;
