# Delivery App Base - Full-Stack Food Delivery Platform

[![Desenvolvido por allysrdev](https://img.shields.io/badge/Desenvolvido%20por-allysrdev-blue?style=flat-square)](https://github.com/allysrdev)

## Visão Geral

Bem-vindo ao **Borchelle Delivery App**! Este projeto, desenvolvido por [@allysrdev](https://github.com/allysrdev), é uma plataforma robusta e moderna construída com Next.js 14 (App Router), TypeScript e Tailwind CSS, servindo como uma base sólida e escalável para uma aplicação completa de delivery de comida. O objetivo é demonstrar habilidades full-stack na criação de aplicações web complexas, interativas e com foco na experiência do usuário.

Este repositório representa um excelente exemplo de aplicação das tecnologias mais recentes do ecossistema React/Next.js, ideal para demonstrar competências técnicas a recrutadores e potenciais empregadores.

## ✨ Demonstração 

*   [Link para Demonstração Ao Vivo](https://demo.guaiamumdigital.com.br/) (Opcional)


## 🚀 Funcionalidades Principais

Este projeto implementa diversas funcionalidades essenciais para uma plataforma de delivery:

*   🔐 **Autenticação Segura:** Sistema completo de Login, Cadastro e Recuperação de Senha utilizando **NextAuth.js**.
*   🛍️ **Catálogo de Produtos e Busca:** Interface para visualização de produtos/restaurantes com funcionalidade de busca integrada.
*   🛒 **Carrinho de Compras Interativo:** Adição, remoção e visualização de itens no carrinho com estado gerenciado eficientemente.
*   💳 **Checkout com Múltiplos Gateways:** Integração com **Stripe** e **Mercado Pago** para processamento seguro de pagamentos.
*   📋 **Gerenciamento de Pedidos:** Área para usuários visualizarem o histórico e o status de seus pedidos.
*   📍 **Integração com Google Maps:** Utilização da API do Google Maps (potencial para busca de endereços, visualização de rotas, etc.).
*   🖼️ **Gerenciamento de Imagens:** Integração com **Cloudinary** para upload, otimização e entrega de imagens.
*   ⚙️ **Dashboard Administrativo:** Uma área dedicada para administradores gerenciarem produtos, pedidos, usuários e visualizarem relatórios (com filtros).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um stack moderno e performático:

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) 14 (App Router)
    *   [React](https://reactjs.org/) 18
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) (Componentes)
*   **Gerenciamento de Estado:**
    *   [TanStack React Query](https://tanstack.com/query/latest) (Cache e Sincronização de Dados)
    *   React Context API
*   **Backend:**
    *   Next.js API Routes
    *   _(Opcional: Mencionar banco de dados/ORM se aplicável, ex: Prisma + PostgreSQL)_
*   **Autenticação:**
    *   [NextAuth.js](https://next-auth.js.org/)
*   **Pagamentos:**
    *   [Stripe](https://stripe.com/)
*   **Formulários:**
    *   [React Hook Form](https://react-hook-form.com/)
    *   [Zod](https://zod.dev/) (Validação)
*   **Outros:**
    *   [Cloudinary](https://cloudinary.com/) (Imagens)
    *   [Google Maps Platform](https://developers.google.com/maps) (Mapas)
    *   [ESLint](https://eslint.org/) (Linting)

## 🏗️ Arquitetura

A aplicação segue uma arquitetura modular e organizada, aproveitando os recursos do Next.js App Router:

*   **Estrutura Baseada em Componentes:** Reutilização de UI através de componentes bem definidos (`/components`).
*   **Separação de Responsabilidades:** Lógica de UI, estado, serviços e API claramente separados em seus respectivos módulos (`/hooks`, `/providers`, `/services`, `/app/api`).
*   **Roteamento por Arquivos:** Utilização do sistema de roteamento do App Router para uma estrutura intuitiva.
*   **Tipagem Forte:** Uso extensivo de TypeScript para garantir a segurança e manutenibilidade do código.

## 🏁 Como Executar Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/allysrdev/delivery-app-base-new.git
    cd delivery-app-base-new
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    *   Renomeie o arquivo `.env.example` (se existir) para `.env`.
    *   Preencha as variáveis de ambiente necessárias no arquivo `.env`. Isso incluirá chaves de API para:
        *   Stripe (Publishable Key, Secret Key)
        *   Mercado Pago (Access Token)
        *   Cloudinary (Cloud Name, API Key, API Secret)
        *   Google Maps API (API Key)
        *   NextAuth.js (NEXTAUTH_SECRET, NEXTAUTH_URL)
        *   _(Outras variáveis específicas do seu backend/DB, se houver)_

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

5.  **Acesse a aplicação:**
    Abra seu navegador e acesse [`http://localhost:3000`](http://localhost:3000).

## 📞 Contato

Desenvolvido por **Allyson Santana** ([@allysrdev](https://github.com/allysrdev)).

*   **GitHub:** [https://github.com/allysrdev](https://github.com/allysrdev)
*   **LinkedIn:** [https://linkedin.com/in/allysantanadev](https://github.com/allysrdev)
*   **Email:** _(contato.allysantana@gmail.com)_

## 📄 Licença

_(**Recomendação:** Adicione uma licença ao seu projeto. Se não tiver uma, a licença MIT é uma escolha popular para projetos open-source.)_

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

*Este README foi gerado com o auxílio de IA para destacar os pontos fortes do projeto para recrutadores.*
