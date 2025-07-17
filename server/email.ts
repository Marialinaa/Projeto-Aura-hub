import nodemailer from 'nodemailer';

// Configurações de email baseadas no config.php
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: 'mariaxxlina@gmail.com',
    pass: 'yqke cagy cgll fspa' // App password do Gmail
  }
};

const ADMIN_EMAIL = 'mariaxxlina@gmail.com';

// Criar transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

// Verificar configuração do email
export const verificarConfiguracao = async () => {
  try {
    await transporter.verify();
    console.log('✅ Configuração de email verificada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração de email:', error);
    return false;
  }
};

// Enviar email para admin sobre nova solicitação
export const notificarAdminNovoUsuario = async (usuario: {
  nome: string;
  email: string;
  login: string;
  endereco: string;
}) => {
  try {
    const mailOptions = {
      from: `"Sistema UFLA" <${SMTP_CONFIG.auth.user}>`,
      to: ADMIN_EMAIL,
      subject: '🔔 Nova Solicitação de Acesso - Sistema UFLA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Nova Solicitação de Acesso</h1>
            <p style="margin: 5px 0 0 0;">Sistema UFLA</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Dados do Solicitante:</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Nome:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${usuario.nome}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${usuario.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Login:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${usuario.login}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;"><strong>Endereço:</strong></td>
                  <td style="padding: 10px 0;">${usuario.endereco}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666;">Acesse o painel administrativo para aprovar ou rejeitar esta solicitação.</p>
              <a href="http://localhost:8080/admin" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                        font-weight: bold; margin-top: 10px;">
                Ir para Painel Admin
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Sistema UFLA - Notificação Automática</p>
            <p style="margin: 5px 0 0 0;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado para admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email para admin:', error);
    return { success: false, error: error.message };
  }
};

// Enviar email de aprovação para usuário
export const notificarUsuarioAprovado = async (usuario: {
  nome: string;
  email: string;
  login: string;
}) => {
  try {
    const mailOptions = {
      from: `"Sistema UFLA" <${SMTP_CONFIG.auth.user}>`,
      to: usuario.email,
      subject: '✅ Acesso Aprovado - Sistema UFLA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎉 Acesso Aprovado!</h1>
            <p style="margin: 5px 0 0 0;">Sistema UFLA</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Olá, ${usuario.nome}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Sua solicitação de acesso foi <strong style="color: #10b981;">APROVADA</strong>! 
                Agora você pode fazer login no sistema com suas credenciais.
              </p>
              
              <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 10px 0;">Suas credenciais:</h3>
                <p style="margin: 5px 0; color: #166534;"><strong>Login:</strong> ${usuario.login}</p>
                <p style="margin: 5px 0; color: #166534;"><strong>Email:</strong> ${usuario.email}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:8080" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                        font-weight: bold; margin-top: 10px;">
                Fazer Login Agora
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Sistema UFLA - Notificação Automática</p>
            <p style="margin: 5px 0 0 0;">Se você não solicitou acesso, ignore este email.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de aprovação enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email de aprovação:', error);
    return { success: false, error: error.message };
  }
};

// Enviar email de rejeição para usuário
export const notificarUsuarioRejeitado = async (usuario: {
  nome: string;
  email: string;
  login: string;
}) => {
  try {
    const mailOptions = {
      from: `"Sistema UFLA" <${SMTP_CONFIG.auth.user}>`,
      to: usuario.email,
      subject: '❌ Solicitação de Acesso Negada - Sistema UFLA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Solicitação Negada</h1>
            <p style="margin: 5px 0 0 0;">Sistema UFLA</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Olá, ${usuario.nome}</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Informamos que sua solicitação de acesso ao Sistema UFLA foi <strong style="color: #ef4444;">NEGADA</strong>.
              </p>
              
              <div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #991b1b; margin: 0 0 10px 0;">Informações da solicitação:</h3>
                <p style="margin: 5px 0; color: #991b1b;"><strong>Login solicitado:</strong> ${usuario.login}</p>
                <p style="margin: 5px 0; color: #991b1b;"><strong>Email:</strong> ${usuario.email}</p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Se você acredita que esta decisão foi tomada por engano ou tem dúvidas, 
                entre em contato com o administrador do sistema.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${ADMIN_EMAIL}" 
                 style="display: inline-block; background: #6b7280; 
                        color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                        font-weight: bold; margin-top: 10px;">
                Contatar Administrador
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Sistema UFLA - Notificação Automática</p>
            <p style="margin: 5px 0 0 0;">Se você não solicitou acesso, ignore este email.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de rejeição enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email de rejeição:', error);
    return { success: false, error: error.message };
  }
};

// Inicializar serviço de email
export const inicializarEmail = async () => {
  console.log('🔧 Inicializando serviço de email...');
  const isValid = await verificarConfiguracao();
  if (isValid) {
    console.log('📧 Serviço de email configurado com sucesso!');
  } else {
    console.log('⚠️ Serviço de email com problemas - emails não serão enviados');
  }
  return isValid;
};
