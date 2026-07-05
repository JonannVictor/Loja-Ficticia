# VivaMart 2.0

Marketplace ficticio brasileiro criado para demonstrar uma experiencia moderna de e-commerce com HTML, CSS e JavaScript puro.

A VivaMart preserva uma identidade acessivel e comercial, com cor teal/turquesa como base, amarelo/laranja para ofertas e CTAs, estrutura por departamentos, vitrine de produtos, carrinho, favoritos e checkout demonstrativo.

> Este projeto e ficticio e foi desenvolvido para fins de demonstracao e portfolio. Nenhuma compra, entrega ou pagamento real e processado.

## Como Rodar

Este projeto usa ES Modules, entao o ideal e servir os arquivos por HTTP local.

```powershell
node scripts/serve.mjs
```

Depois acesse:

```text
http://127.0.0.1:5273
```

## Funcionalidades

- Home com hero carousel de campanhas.
- Header sticky com busca, CEP, conta, favoritos e carrinho.
- Botao de tema claro/escuro com persistencia local.
- Botao de idioma PT/EN com traducao da interface e persistencia local.
- Barra promocional rotativa.
- Mega menu de departamentos no desktop.
- Drawer de departamentos no mobile.
- Busca com sugestoes, produtos encontrados, categorias e historico local.
- Vitrine com filtros: Todos, Casa, Informatica, Celulares, Mais vendidos, Ofertas e Novidades.
- Cards de produto com imagem, badges, avaliacao ficticia, desconto, frete demonstrativo, favorito e CTA.
- Pagina de produto com galeria, variacoes, quantidade, frete simulado e produtos relacionados.
- Mini carrinho em drawer lateral.
- Pagina completa de carrinho.
- Checkout demonstrativo em etapas.
- Pagina de sucesso com pedido ficticio.
- Sistema de favoritos com `localStorage`.
- Usuario e CEP simulados com `localStorage`.
- Preferencia de tema e idioma salvas em `localStorage`.
- Recomendacoes locais baseadas em produtos vistos e buscas recentes.
- Oferta Relampago com contador e estoque demonstrativos.
- Microinteracoes, toasts e animacoes sutis.
- Layout responsivo com navegacao inferior no mobile.

## Rotas

As rotas usam hash routing:

```text
#/
#/produtos
#/categoria/Casa
#/produto/aura-x-256
#/favoritos
#/carrinho
#/checkout
#/sucesso
#/busca/notebook
```

## Estrutura

```text
.
├── index.html
├── styles.css
├── app.js
├── data/
│   └── products.js
├── services/
│   └── storage.js
├── utils/
│   └── format.js
└── scripts/
    └── serve.mjs
```

## Arquitetura

- `index.html`: casca semantica da aplicacao, modais, drawers, header, footer e regioes principais.
- `styles.css`: sistema visual, responsividade, animacoes e componentes.
- `app.js`: roteamento, estado de UI, carrinho, favoritos, busca, checkout e renderizacao.
- `data/products.js`: produtos, campanhas, departamentos e mensagens promocionais mockadas.
- `services/storage.js`: leitura e escrita segura em `localStorage`.
- `utils/format.js`: formatacao de moeda, estrelas e helpers simples.
- `scripts/serve.mjs`: servidor HTTP local para desenvolvimento.

## Verificacoes Realizadas

```powershell
node --check app.js
node --check data/products.js
node --check scripts/serve.mjs
```

Tambem foi verificado que o servidor local responde os arquivos principais:

```text
index.html -> 200
app.js -> 200
styles.css -> 200
data/products.js -> 200
```

## Observacoes

- As imagens sao carregadas de URLs externas do Unsplash.
- O projeto nao possui backend.
- O checkout e apenas visual e demonstrativo.
- Os dados de usuario, CEP, carrinho, favoritos, buscas e produtos vistos ficam apenas no navegador via `localStorage`.
- O projeto nao usa bibliotecas pesadas nem processo de build.

## Proximas Melhorias

- Adicionar testes automatizados de interface com Playwright.
- Separar `app.js` em modulos menores por dominio: carrinho, busca, rotas, checkout e produto.
- Criar componentes reutilizaveis para produto, resumo de compra, drawer e modal.
- Melhorar o gerenciamento de foco em drawers e dialogs com focus trap completo.
- Adicionar skeleton loading para imagens e secoes de produto.
- Criar assets locais otimizados para evitar dependencia de imagens externas.
- Adicionar pagina de listagem com ordenacao por preco, avaliacao e desconto.
- Criar filtros mais completos por faixa de preco, categoria, frete e avaliacao.
- Adicionar validacoes visuais mais completas no checkout demonstrativo.
- Persistir estado de filtros e ordenacao na URL.
