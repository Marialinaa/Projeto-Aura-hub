// server/routes/auth.ts
import { Request, Response } from "express";
import DatabaseConnection from '../database';
import bcrypt from 'bcrypt';

// ============================================
// HELPER: Tratamento centralizado de erros
// ============================================
function handleDatabaseError(error: any, res: Response) {
  if (error.message && error.message.includes('pool not initialized')) {
    return res.status(503).json({ 
      success: false,
      message: 'Serviço temporariamente indisponível. Tente novamente em alguns segundos.'
    });
  }
  console.error('Database error:', error);
  return res.status(500).json({ 
    success: false,
    message: 'Erro interno do servidor' 
  });
}

// ============================================
// LOGIN - APENAS USUÁRIOS APROVADOS
// ============================================
export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Tentativa de login:", { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // ✅ Obter pool de forma segura
    const pool = await DatabaseConnection.getInstance();

    // Buscar usuário APENAS na tabela usuarios (somente aprovados)
    const [rows] = await pool.execute(
      'SELECT id, nome_completo, login, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ?',
      [email]
    );

    const users = rows as any[];
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado ou não aprovado. Verifique se sua conta foi aprovada pelo administrador."
      });
    }

    const user = users[0];

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.senha_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta."
      });
    }

    console.log("✅ Login bem-sucedido para:", user.email);

    // SE FOR BOLSISTA, REGISTRAR ENTRADA AUTOMATICAMENTE
    if (user.tipo_usuario === 'bolsista') {
      try {
        console.log("📝 Registrando entrada automática para bolsista:", user.id);
        
        // Verificar se já há entrada em aberto hoje
        const hoje = new Date().toISOString().split('T')[0];
        const [entradaAberta]: any = await pool.execute(
          'SELECT id FROM registros_entrada WHERE usuario_id = ? AND data_entrada = ? AND hora_saida IS NULL',
          [user.id, hoje]
        );
        
        if (!entradaAberta || entradaAberta.length === 0) {
          // Registrar nova entrada
          const agora = new Date();
          const horaAtual = agora.toTimeString().split(' ')[0];
          
          await pool.execute(
            `INSERT INTO registros_entrada (usuario_id, data_entrada, hora_entrada) 
             VALUES (?, ?, ?)`,
            [user.id, hoje, horaAtual]
          );
          
          console.log(`✅ Entrada registrada para bolsista ${user.id} às ${horaAtual}`);
        } else {
          console.log(`ℹ️ Bolsista ${user.id} já tem entrada registrada hoje`);
        }
      } catch (entradaError) {
        console.error('❌ Erro ao registrar entrada automática:', entradaError);
        // Não falhar o login por causa do erro de entrada
      }
    }

    // Atualizar último login
    try {
      await pool.execute(
        'UPDATE usuarios SET data_ultimo_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );
    } catch (updateError) {
      console.warn('⚠️ Erro ao atualizar último login:', updateError);
      // Não falhar o login por causa deste erro
    }

    // Determinar dashboard baseado no tipo de usuário
    let redirectTo = '/dashboard'; // default
    if (user.tipo_usuario === 'bolsista') {
      redirectTo = '/bolsista-dashboard';
    } else if (user.tipo_usuario === 'responsavel') {
      redirectTo = '/responsavel-dashboard';
    } else if (user.tipo_usuario === 'admin') {
      redirectTo = '/admin-dashboard';
    }

    // Retorno do login bem-sucedido
    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        nome: user.nome_completo,
        email: user.email,
        login: user.login,
        tipo_usuario: user.tipo_usuario
      },
      redirectTo: redirectTo
    });

  } catch (error: any) {
    console.error('❌ Erro no login:', error);
    return handleDatabaseError(error, res);
  }
};

// ============================================
// REGISTRO - VIA SOLICITAÇÕES 
// ============================================
export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { nome, funcao, endereco, email, login, senha, tipoUsuario } = req.body;

    console.log("📝 Tentativa de registro:", { email, nome, funcao, tipoUsuario });

    // Validar campos obrigatórios básicos
    const camposObrigatorios = ['nome', 'email', 'login', 'senha', 'tipoUsuario'];
    for (const campo of camposObrigatorios) {
      if (!req.body[campo]) {
        return res.status(400).json({
          success: false,
          message: `Campo '${campo}' é obrigatório`
        });
      }
    }

    // Validar campos específicos por tipo de usuário
    if (tipoUsuario === 'responsavel' && !funcao) {
      return res.status(400).json({
        success: false,
        message: 'Campo "funcao" é obrigatório para responsáveis'
      });
    }

    // Validar tipoUsuario
    if (!['responsavel', 'bolsista'].includes(tipoUsuario)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de usuário deve ser "responsavel" ou "bolsista"'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validar senha
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // ✅ Obter pool de forma segura
    const pool = await DatabaseConnection.getInstance();

    // Verificar se email já existe nas duas tabelas
    const [emailUsuarios] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    const [emailSolicitacoes] = await pool.execute(
      'SELECT id FROM solicitacoes WHERE email = ?',
      [email]
    );

    if ((emailUsuarios as any[]).length > 0 || (emailSolicitacoes as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado no sistema'
      });
    }

    // Verificar se login já existe nas duas tabelas
    const [loginUsuarios] = await pool.execute(
      'SELECT id FROM usuarios WHERE login = ?',
      [login]
    );

    const [loginSolicitacoes] = await pool.execute(
      'SELECT id FROM solicitacoes WHERE login = ?',
      [login]
    );

    if ((loginUsuarios as any[]).length > 0 || (loginSolicitacoes as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Login já está em uso'
      });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir na tabela solicitacoes (aguardando aprovação)
    const [result] = await pool.execute(
      `INSERT INTO solicitacoes (nome_completo, funcao, endereco, email, login, senha_hash, tipo_usuario, status, data_criacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente', CURRENT_TIMESTAMP)`,
      [nome, funcao, endereco, email, login, senhaHash, tipoUsuario]
    );

    const insertResult = result as any;
    const novoId = insertResult.insertId;

    console.log(`✅ Solicitação criada com ID: ${novoId}`);

    return res.json({
      success: true,
      message: 'Solicitação de cadastro enviada com sucesso! Aguarde a aprovação do administrador.',
      data: {
        id: novoId,
        nome: nome,
        email: email,
        login: login,
        tipo_usuario: tipoUsuario,
        status: 'pendente'
      }
    });

  } catch (error: any) {
    console.error("❌ Erro no registro:", error);
    return handleDatabaseError(error, res);
  }
};
