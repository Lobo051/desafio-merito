# desafio-fullstack-merito-2





Desafio Fullstack Mérito - Dashboard de Investimentos

Este projeto é uma aplicação web fullstack simples para gerenciar um dashboard de investimentos, permitindo cadastrar fundos, registrar movimentações (aportes e resgates) e visualizar o saldo da carteira e o histórico de transações.

Tecnologias Utilizadas

•
Backend: Python 3.11, Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Flask-Cors

•
Frontend: React.js, Axios

•
Banco de Dados: SQLite (padrão)

•
Ambiente: Desenvolvido e testado em ambiente Linux (Ubuntu 22.04).

Funcionalidades

•
Cadastro de Fundos: Permite adicionar novos fundos de investimento com nome, código (ticker), tipo e valor da cota inicial.

•
Registro de Movimentações: Permite registrar aportes e resgates para fundos específicos, atualizando a quantidade de cotas e impactando o saldo.

•
Visualização:

•
Exibe o saldo total atual da carteira.

•
Mostra detalhes por fundo (cotas atuais, valor da cota, saldo no fundo).

•
Apresenta uma tabela com o histórico de todas as movimentações, ordenada por data (mais recente primeiro).



Como Rodar o Projeto Localmente

Pré-requisitos

•
Python 3.11 ou superior

•
Node.js e npm (ou yarn)

•
Git (opcional, para clonar)

Backend

1.
Navegue até o diretório do backend:

2.
Crie e ative um ambiente virtual:

3.
Instale as dependências:

4.
Inicialize o banco de dados (se for a primeira vez):
O Flask-Migrate pode ser usado para gerenciar as migrações do banco de dados. Embora a aplicação crie as tabelas automaticamente na primeira execução (db.create_all() em app.py), para um fluxo mais robusto com migrações:

5.
Execute o servidor Flask:

Frontend

1.
Abra outro terminal e navegue até o diretório do frontend:

2.
Instale as dependências:

3.
Inicie o servidor de desenvolvimento React:

Como Testar as APIs

Você pode usar ferramentas como Postman, Insomnia ou curl para interagir diretamente com a API RESTful do backend (http://localhost:5000/api).

Exemplos com curl:

•
Listar todos os fundos:

•
Cadastrar um novo fundo:

•
Registrar um aporte:

•
Verificar saldo da carteira:

•
Listar movimentações:

Estrutura do Projeto

Plain Text


desafio-fullstack-merito/
├── backend/
│   ├── venv/                   # Ambiente virtual Python
│   ├── migrations/             # Diretório do Flask-Migrate (se inicializado)
│   ├── app.py                  # Arquivo principal da aplicação Flask (entrypoint)
│   ├── config.py               # Configurações da aplicação
│   ├── models.py               # Modelos SQLAlchemy (Fundo, Movimentacao)
│   ├── resources.py            # Recursos Flask-RESTful (endpoints da API)
│   ├── requirements.txt        # Dependências Python (a ser gerado)
│   └── app.db                  # Banco de dados SQLite
├── frontend/
│   ├── node_modules/           # Dependências Node.js
│   ├── public/                 # Arquivos estáticos públicos
│   ├── src/
│   │   ├── components/         # Componentes React reutilizáveis
│   │   │   ├── FundoForm.js
│   │   │   ├── MovimentacaoForm.js
│   │   │   ├── MovimentacaoTable.js
│   │   │   └── SaldoCarteira.js
│   │   ├── App.css             # Estilos principais
│   │   ├── App.js              # Componente principal da aplicação React
│   │   ├── index.css           # Estilos globais
│   │   └── index.js            # Ponto de entrada do React
│   ├── .gitignore              # Arquivos ignorados pelo Git
│   ├── package.json            # Metadados e dependências do projeto Node.js
│   └── package-lock.json       # Lockfile das dependências
└── README.md                   # Este arquivo


Considerações

•
Simplicidade: O foco foi na lógica de negócio e estrutura da aplicação, conforme solicitado. A interface do usuário é funcional, mas visualmente simples.

•
Sem Autenticação: Não foi implementado sistema de login ou autenticação.

•
Cálculo de Cotas: O cálculo da quantidade de cotas em aportes/resgates é feito com base no valor da cota do fundo no momento do cadastro do fundo. Em um sistema real, o valor da cota deveria ser atualizado ou buscado no momento da transação.

•
Validações: Foram implementadas validações básicas (campos obrigatórios, tipo de movimentação, saldo de cotas para resgate).

•
Tratamento de Erros: Tratamento básico de erros na API e no frontend.

Próximos Passos (Opcionais não implementados neste momento)

•
Testes Automatizados: Adicionar testes unitários e de integração para o backend.

•
Docker: Criar Dockerfile para o backend e docker-compose.yml para orquestrar os serviços.

•
CI/CD: Configurar um pipeline básico de CI/CD (ex: GitHub Actions) para rodar testes e simular deploy.

•
Melhorias na UI/UX: Refinar o visual e a experiência do usuário no frontend.

•
Atualização de Cota: Implementar busca de valor de cota atualizado (via API externa ou manualmente).

•
Banco de Dados: Configurar para usar PostgreSQL em vez de SQLite para um ambiente mais robusto.

