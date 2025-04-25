'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, resetLink: string) => {
    await resend.emails.send({
        from: 'GuaiaDelivery <contato@guaiamumdigital.com.br>',
        to: email,
        subject: 'Recuperação de Senha',
        html: `<p>Clique no link para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
        });
}