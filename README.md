
 Desafio Fullstack Mérito 2

Descrição

Este projeto é uma aplicação web fullstack simples para gerenciar um dashboard de investimentos, permitindo:

- Cadastrar fundos
- Registrar movimentações (aportes e resgates)
- Visualizar o saldo da carteira e histórico detalhado de operações

---

 Tecnologias Utilizadas :

- Backend: Python 3.11, Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Flask-Cors
- Frontend: React.js, Axios
- Banco de Dados: SQLite (padrão)
- Ambiente: Desenvolvido e testado em Linux (Ubuntu 22.04)

---

Funcionalidades

- Cadastro de Fundos: Adicione novos fundos de investimento com nome, código (ticker), tipo e valor da cota inicial.
- Registro de Movimentações: Registre aportes e resgates para fundos específicos, atualizando a quantidade de cotas e impactando o saldo.
- Visualização:
  - Exibe o saldo total atual da carteira
  - Detalhes por fundo (cotas atuais, valor da cota, saldo no fundo)
  - Tabela com o histórico de todas as movimentações, ordenada por data (mais recente primeiro)

---

Como Rodar o Projeto Localmente

Pré-requisitos

- Python 3.11 ou superior
- Node.js e npm (ou yarn)
- Git (opcional, para clonar o repositório)

Backend

1. Navegue até o diretório do backend:
   ```bash
   cd desafio-fullstack-merito/backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicialize o banco de dados (se for a primeira vez):
   - A aplicação cria as tabelas automaticamente na primeira execução (`db.create_all()` em `app.py`).
   - Para usar o Flask-Migrate:
     ```bash
     flask db init
     flask db migrate
     flask db upgrade
     ```
5. Execute o servidor Flask:
   ```bash
   flask run
   ```
   O backend estará disponível em `http://localhost:5000`.

Frontend

1. Abra outro terminal e navegue até o diretório do frontend:
   ```bash
   cd desafio-fullstack-merito/frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento React:
   ```bash
   npm start
   ```
   O frontend estará disponível em `http://localhost:3000`.

---

 Como Testar as APIs:

Você pode utilizar ferramentas como Postman, Insomnia ou curl para interagir diretamente com a API RESTful do backend (`http://localhost:5000/api`).

 Exemplos com curl:

- Listar todos os fundos:
  ```bash
  curl http://localhost:5000/api/fundos
  ```
- Cadastrar um novo fundo:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"nome":"Fundo XPTO","ticker":"XPTO11","tipo":"Renda Fixa","valor_cota":100}' http://localhost:5000/api/fundos
  ```
- Registrar um aporte:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"tipo":"aporte","fundo_id":1,"valor":500}' http://localhost:5000/api/movimentacoes
  ```
- Verificar saldo da carteira:
  ```bash
  curl http://localhost:5000/api/saldo
  ```
- Listar movimentações:
  ```bash
  curl http://localhost:5000/api/movimentacoes
  ```

---

 Estrutura do Projeto

```
desafio-fullstack-merito/
├── backend/
│   ├── venv/                   # Ambiente virtual Python
│   ├── migrations/             # Diretório do Flask-Migrate (se inicializado)
│   ├── app.py                  # Arquivo principal da aplicação Flask (entrypoint)
│   ├── config.py               # Configurações da aplicação
│   ├── models.py               # Modelos SQLAlchemy (Fundo, Movimentacao)
│   ├── resources.py            # Recursos Flask-RESTful (endpoints da API)
│   ├── requirements.txt        # Dependências Python
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
```

---

 Considerações

- Simplicidade: O foco foi na lógica de negócio e estrutura da aplicação. A interface do usuário é funcional, porém simples.
- Sem Autenticação: Não há sistema de login ou autenticação.
- Cálculo de Cotas: O cálculo da quantidade de cotas em aportes/resgates é feito com base no valor da cota do fundo no momento do cadastro. Em um sistema real, o valor da cota deveria ser atualizado periodicamente.
- Validações: Foram implementadas validações básicas (campos obrigatórios, tipo de movimentação, saldo de cotas para resgate).
- Tratamento de Erros:Tratamento básico de erros na API e no frontend.

---

Próximos Passos (Opcionais)

- Adicionar testes automatizados (unitários e integração) para o backend.
- Criar Dockerfile para o backend e um docker-compose.yml para orquestrar os serviços.
- Configurar um pipeline básico de CI/CD (ex: GitHub Actions) para rodar testes e simular deploy.
- Melhorar a interface e experiência do usuário (UI/UX).
- Implementar atualização do valor da cota (via API externa ou manualmente).
- Configurar uso de PostgreSQL para ambientes mais robustos.
