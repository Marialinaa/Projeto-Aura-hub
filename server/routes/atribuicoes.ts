// server/routes/atribuicoes.ts
import { Request, Response } from "express";
import { pool } from '../database';

export interface Atribuicao {
  id: number;
  responsavelId: number;
  bolsistaId: string;  // matrícula do bolsista
  responsavelNome: string;
  bolsistaNome: string;
  dataAtribuicao: string;
  status: 'ativa' | 'inativa';
  observacoes?: string;
}

// GET /api/atribuicoes - Listar todas as atribuições
export const handleListAtribuicoes = async (req: Request, res: Response) => {
  try {
    console.log("📋 Listando atribuições...");

    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.responsavel_id as responsavelId,
        a.bolsista_matricula as bolsistaId,
        r.nome as responsavelNome,
        b.nome as bolsistaNome,
        DATE_FORMAT(a.data_atribuicao, '%d/%m/%Y') as dataAtribuicao,
        a.status,
        a.observacoes
      FROM atribuicoes a
      JOIN responsaveis r ON a.responsavel_id = r.id
      JOIN bolsistas b ON a.bolsista_matricula = b.matricula
      WHERE a.status = 'ativa'
      ORDER BY a.data_atribuicao DESC
    `);

    const atribuicoes = rows as Atribuicao[];
    
    console.log(`✅ ${atribuicoes.length} atribuições encontradas`);

    res.json({
      success: true,
      data: atribuicoes,
      message: `${atribuicoes.length} atribuições encontradas`
    });

  } catch (error: any) {
    console.error("❌ Erro ao listar atribuições:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar atribuições"
    });
  }
};

// POST /api/atribuicoes - Criar nova atribuição
export const handleCreateAtribuicao = async (req: Request, res: Response) => {
  try {
    const { responsavelId, bolsistaId, observacoes } = req.body;

    console.log("🔗 Criando nova atribuição:", { responsavelId, bolsistaId });

    if (!responsavelId || !bolsistaId) {
      return res.status(400).json({
        success: false,
        message: "Responsável e bolsista são obrigatórios"
      });
    }

    // Verificar se já existe atribuição ativa
    const [existingRows] = await pool.execute(
      'SELECT id FROM atribuicoes WHERE responsavel_id = ? AND bolsista_matricula = ? AND status = "ativa"',
      [responsavelId, bolsistaId]
    );

    if ((existingRows as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: "Este bolsista já está atribuído a este responsável"
      });
    }

    // Verificar se responsável existe e está liberado
    const [responsavelRows] = await pool.execute(
      'SELECT id, nome FROM responsaveis WHERE id = ? AND status = "liberado"',
      [responsavelId]
    );

    if ((responsavelRows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Responsável não encontrado ou não liberado"
      });
    }

    // Verificar se bolsista existe e está liberado
    const [bolsistaRows] = await pool.execute(
      'SELECT matricula, nome FROM bolsistas WHERE matricula = ? AND status = "liberado"',
      [bolsistaId]
    );

    if ((bolsistaRows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bolsista não encontrado ou não liberado"
      });
    }

    const responsavel = (responsavelRows as any[])[0];
    const bolsista = (bolsistaRows as any[])[0];

    // Criar atribuição
    const [result] = await pool.execute(
      `INSERT INTO atribuicoes (responsavel_id, bolsista_matricula, observacoes, status) 
       VALUES (?, ?, ?, 'ativa')`,
      [responsavelId, bolsistaId, observacoes || null]
    );

    const insertResult = result as any;
    const novaAtribuicaoId = insertResult.insertId;

    // Buscar a atribuição criada
    const [newAtribuicaoRows] = await pool.execute(`
      SELECT 
        a.id,
        a.responsavel_id as responsavelId,
        a.bolsista_matricula as bolsistaId,
        r.nome as responsavelNome,
        b.nome as bolsistaNome,
        DATE_FORMAT(a.data_atribuicao, '%d/%m/%Y') as dataAtribuicao,
        a.status,
        a.observacoes
      FROM atribuicoes a
      JOIN responsaveis r ON a.responsavel_id = r.id
      JOIN bolsistas b ON a.bolsista_matricula = b.matricula
      WHERE a.id = ?
    `, [novaAtribuicaoId]);

    const novaAtribuicao = (newAtribuicaoRows as any[])[0];

    console.log(`✅ Atribuição criada: ${responsavel.nome} -> ${bolsista.nome}`);

    res.status(201).json({
      success: true,
      data: novaAtribuicao,
      message: `Bolsista ${bolsista.nome} atribuído ao responsável ${responsavel.nome} com sucesso!`
    });

  } catch (error: any) {
    console.error("❌ Erro ao criar atribuição:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar atribuição"
    });
  }
};

// PUT /api/atribuicoes/:id - Atualizar atribuição
export const handleUpdateAtribuicao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { responsavelId, bolsistaId, observacoes } = req.body;

    console.log("✏️ Atualizando atribuição:", { id, responsavelId, bolsistaId });

    if (!responsavelId || !bolsistaId) {
      return res.status(400).json({
        success: false,
        message: "Responsável e bolsista são obrigatórios"
      });
    }

    // Verificar se a atribuição existe
    const [existingRows] = await pool.execute(
      'SELECT id FROM atribuicoes WHERE id = ?',
      [id]
    );

    if ((existingRows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Atribuição não encontrada"
      });
    }

    // Verificar se já existe outra atribuição ativa com a mesma combinação
    const [conflictRows] = await pool.execute(
      'SELECT id FROM atribuicoes WHERE responsavel_id = ? AND bolsista_matricula = ? AND status = "ativa" AND id != ?',
      [responsavelId, bolsistaId, id]
    );

    if ((conflictRows as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: "Já existe uma atribuição ativa entre este responsável e bolsista"
      });
    }

    // Atualizar atribuição
    await pool.execute(
      `UPDATE atribuicoes 
       SET responsavel_id = ?, bolsista_matricula = ?, observacoes = ?, data_atualizacao = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [responsavelId, bolsistaId, observacoes || null, id]
    );

    // Buscar a atribuição atualizada
    const [updatedRows] = await pool.execute(`
      SELECT 
        a.id,
        a.responsavel_id as responsavelId,
        a.bolsista_matricula as bolsistaId,
        r.nome as responsavelNome,
        b.nome as bolsistaNome,
        DATE_FORMAT(a.data_atribuicao, '%d/%m/%Y') as dataAtribuicao,
        a.status,
        a.observacoes
      FROM atribuicoes a
      JOIN responsaveis r ON a.responsavel_id = r.id
      JOIN bolsistas b ON a.bolsista_matricula = b.matricula
      WHERE a.id = ?
    `, [id]);

    const atribuicaoAtualizada = (updatedRows as any[])[0];

    console.log(`✅ Atribuição ${id} atualizada com sucesso`);

    res.json({
      success: true,
      data: atribuicaoAtualizada,
      message: "Atribuição atualizada com sucesso!"
    });

  } catch (error: any) {
    console.error("❌ Erro ao atualizar atribuição:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar atribuição"
    });
  }
};

// DELETE /api/atribuicoes/:id - Remover atribuição
export const handleDeleteAtribuicao = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Removendo atribuição:", id);

    // Verificar se a atribuição existe
    const [existingRows] = await pool.execute(
      'SELECT id FROM atribuicoes WHERE id = ?',
      [id]
    );

    if ((existingRows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Atribuição não encontrada"
      });
    }

    // Marcar como inativa em vez de deletar (soft delete)
    await pool.execute(
      `UPDATE atribuicoes 
       SET status = 'inativa', data_atualizacao = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    console.log(`✅ Atribuição ${id} removida com sucesso`);

    res.json({
      success: true,
      message: "Atribuição removida com sucesso!"
    });

  } catch (error: any) {
    console.error("❌ Erro ao remover atribuição:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover atribuição"
    });
  }
};
