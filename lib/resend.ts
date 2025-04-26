'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendEmail = async (email: string, resetLink: string) => {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Redefinir Senha</title>
      <style>
        body {
          background-color: #121212;
          color: white;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.7);
        }
        .header {
          background-color: #222;
          padding: 30px;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: 1px;
        }
        .content {
          padding: 30px;
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 15px 30px;
          background-color: #ffffff;
          color: black;
          text-decoration: none;
          font-size: 16px;
          border-radius: 8px;
          transition: background 0.3s;
        }
        .button:hover {
          background-color: #cccccc;
        }
        .footer {
          background-color: #181818;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: white;
        }
        a {
          color: white;
          word-break: break-all;
        }
        p {
            color: white;
        }
      </style>
    </head>
    <body>
    
    <div class="container">
      <div class="header">
        Redefinir sua senha
      </div>
      <div class="content">
        <p>Olá,</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <a href="${resetLink}" class="button">Redefinir Senha</a>
    
        <p style="margin-top: 30px;">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
      </div>
      <div class="footer">
        © 2025 Guaiamum Digital - GuaiaDelivery. Todos os direitos reservados.
      </div>
    </div>
    
    </body>
    </html>
    
    
    `
    await resend.emails.send({
        from: 'GuaiaDelivery <contato@guaiamumdigital.com.br>',
        to: email,
        subject: 'Recuperação de Senha',
        html,
        });
}