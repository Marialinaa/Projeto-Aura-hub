import { Request, Response } from "express";
import { createConnection } from "../database";
import multer from "multer";

// Estender o tipo Request para incluir o arquivo
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Configurar multer para upload de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const error = new Error('Apenas arquivos de imagem são permitidos') as any;
      error.code = 'LIMIT_FILE_TYPE';
      cb(error, false);
    }
  }
});

// Middleware para upload de arquivo único
export const uploadFoto = upload.single('foto');

// Criar item XPTO
export const handleCreateXpto = async (req: RequestWithFile, res: Response) => {
  try {
    const { nome, descricao } = req.body;
    const foto = req.file;

    if (!nome || !descricao) {
      return res.status(400).json({
        success: false,
        message: "Nome e descrição são obrigatórios"
      });
    }

    const connection = await createConnection();

    let query: string;
    let params: any[];

    if (foto) {
      // Com foto
      query = `
        INSERT INTO xpto_items (nome, descricao, foto, foto_nome, foto_tipo, foto_tamanho)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      params = [
        nome,
        descricao,
        foto.buffer,
        foto.originalname,
        foto.mimetype,
        foto.size
      ];
    } else {
      // Sem foto
      query = `
        INSERT INTO xpto_items (nome, descricao)
        VALUES (?, ?)
      `;
      params = [nome, descricao];
    }

    const [result] = await connection.execute(query, params) as any;
    await connection.end();

    res.json({
      success: true,
      message: "Item criado com sucesso",
      id: result.insertId
    });

  } catch (error) {
    console.error("Erro ao criar item XPTO:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Listar itens XPTO
export const handleListXpto = async (req: Request, res: Response) => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT 
        id,
        nome,
        descricao,
        foto_nome,
        foto_tipo,
        foto_tamanho,
        data_criacao,
        data_atualizacao,
        CASE WHEN foto IS NOT NULL THEN true ELSE false END as tem_foto
      FROM xpto_items
      ORDER BY data_criacao DESC
    `);

    await connection.end();

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("Erro ao listar itens XPTO:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Obter foto específica
export const handleGetFoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT foto, foto_tipo, foto_nome
      FROM xpto_items
      WHERE id = ? AND foto IS NOT NULL
    `, [id]) as any;

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Foto não encontrada"
      });
    }

    const item = rows[0];

    res.set({
      'Content-Type': item.foto_tipo,
      'Content-Disposition': `inline; filename="${item.foto_nome}"`
    });

    res.send(item.foto);

  } catch (error) {
    console.error("Erro ao obter foto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// Deletar item XPTO
export const handleDeleteXpto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const connection = await createConnection();

    const [result] = await connection.execute(`
      DELETE FROM xpto_items WHERE id = ?
    `, [id]) as any;

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Item não encontrado"
      });
    }

    res.json({
      success: true,
      message: "Item deletado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao deletar item XPTO:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};
