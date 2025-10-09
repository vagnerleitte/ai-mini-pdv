# 🧠 Mini PDV — Projeto guiado por IA

Este repositório é o resultado prático da série **“IA acelerando o desenvolvimento”**, onde todo o código foi gerado iterativamente com o apoio de IA (Codex, Copilot e GPT).  
O projeto demonstra **NestJS**, **Angular**, **Taiga UI** e **Signals** aplicados no desenvolvimento de um **Mini PDV** — do backend ao frontend.

---

## 📚 Série de artigos que originou este projeto

1️⃣ [Dois meses com IA: do zero ao EquiProvas](https://www.linkedin.com/pulse/dois-meses-com-ia-jornada-que-mudou-minha-forma-de-leite-da-silva-quh7f)  
2️⃣ [Do EquiProvas ao primeiro protótipo com IA](https://www.linkedin.com/pulse/do-equiprovas-ao-primeiro-prot%25C3%25B3tipo-com-ia-vagner-leite-da-silva-kh1df)  
3️⃣ [Como desenhei o front do Mini PDV com IA e Taiga UI](https://www.linkedin.com/pulse/como-desenhei-o-front-do-mini-pdv-com-ia-e-taiga-ui-leite-da-silva-hggff)  
4️⃣ [Como construí o front do Mini PDV — Parte 1: Signals, Store e Listagem com Angular + Taiga UI](https://www.linkedin.com/pulse/como-constru%C3%AD-o-front-do-mini-pdv-parte-1-signals-e-leite-da-silva-hotmf/?trackingId=epF8PpPyanYSjMRJL0GWKg%3D%3D)

> **Em andamento:** “Parte 2 — Forms Reativos, Entrada e Venda”.

---

## ⚙️ Estrutura do monorepo (PNPM)

Monorepo preparado para crescer com novos apps e libs internas.

```bash

mini-pdv/
├── apps/
│ ├── api/ # Backend — NestJS + Prisma + SQLite
│ │ ├── src/
│ │ ├── prisma/
│ │ └── main.ts
│ └── web/ # Frontend — Angular 17 + Signals + Taiga UI
│ ├── src/app/
│ │ ├── pages/
│ │ │ ├── products-list.page.ts
│ │ │ ├── product-create.page.ts
│ │ │ ├── stock-entry.page.ts
│ │ │ ├── sale-create.page.ts
│ │ │ └── product-details.page.ts
│ │ ├── core/ (store + services)
│ │ └── app.routes.ts
│ └── assets/
├── docs/
│ └── images/
│ ├── list.png
│ ├── create.png
│ ├── entry.png
│ ├── sales.png
│ └── details.png
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

---

## 💻 Requisitos

- **Node.js** 18+
- **pnpm** 8.x
- (opcional) **Nest CLI** e **Angular CLI**

---

## 🚀 Instalação

```bash
pnpm install
```

---

## ▶️ Execução

### API (NestJS + Prisma + SQLite)

```bash
pnpm --filter api start:dev
```

- A API sobe em `http://localhost:3000`.
- **CORS:** habilite para `http://localhost:4200`.
- **Prefixo de rotas:** se usar `app.setGlobalPrefix('api')`, ajuste o frontend para chamar `http://localhost:3000/api/...`.

### Frontend (Angular + Taiga UI)

```bash
pnpm --filter web start
```

- App em `http://localhost:4200`.
- Rota inicial redireciona para `/produtos`.

---

## 🧩 Funcionalidades

- **Produtos:** criar, listar, consultar detalhes
- **Estoque:** entrada e saída com atualização do saldo
- **Vendas:** registro e cálculo de total
- **UI:** design limpo com Taiga UI + Signals
- **Arquitetura:** monorepo escalável com PNPM

---

## 🖼️ Interfaces (designs)

As telas foram geradas/ajustadas com IA. As imagens ficam em `docs/images`:

| Tela                     | Descrição            | Arquivo                                            |
| ------------------------ | -------------------- | -------------------------------------------------- |
| **Listagem de Produtos** | Busca/links/ações    | [docs/images/list.png](docs/images/list.png)       |
| **Cadastro de Produto**  | Form reativo         | [docs/images/create.png](docs/images/create.png)   |
| **Entrada de Estoque**   | Prévia de novo saldo | [docs/images/entry.png](docs/images/entry.png)     |
| **Venda**                | Total calculado      | [docs/images/sales.png](docs/images/sales.png)     |
| **Detalhes do Produto**  | Info + ações rápidas | [docs/images/details.png](docs/images/details.png) |

---

## 🧠 Stack

| Camada   | Tecnologia                                             |
| -------- | ------------------------------------------------------ |
| Backend  | NestJS + Prisma + SQLite                               |
| Frontend | Angular 17 (standalone) + Signals + Taiga UI           |
| Monorepo | PNPM Workspaces                                        |
| IA       | Codex / Copilot / GPT (prompts e geração de código/UI) |

---

## 🔎 Quer ver código?

Todo o histórico com commits por etapa está aqui:
**[https://github.com/vagnerleitte/ai-mini-pdv](https://github.com/vagnerleitte/ai-mini-pdv)**

---

## 🎯 Spoiler — Roadmap futuro

- **Parte 2 do Frontend:** Forms Reativos, Entrada e Venda
- **Parte 3:** Deploy (Netlify) + CI/CD (GitHub Actions) + envs
- **Refinos:** testes e2e, guards, paginação/filtros

---

> _Este repositório é um estudo real de como a IA acelera o desenvolvimento — cada commit reflete uma etapa da interação com prompts controlados._
