# Full Stack Travel Story
> **MongoDB, React, Node

Este projeto é uma aplicação web Full Stack para criar, visualizar e compartilhar histórias de viagens. A aplicação foi desenvolvida utilizando (MongoDB, Express, React e Node.js), que permite uma experiência eficiente e escalável tanto no front-end quanto no back-end.

---

## 🚀 **Funcionalidades**

- **Cadastro e Login de Usuários**:
  - Autenticação com JWT (JSON Web Token).
  - Proteção de rotas para garantir segurança.

- **Gerenciamento de Histórias**:
  - Criar, editar, deletar e visualizar histórias de viagens.
  - Upload de imagens para ilustrar as histórias.

- **Interface de Usuário**:
  - Interface responsiva construída com React.
  - Design intuitivo e moderno.

- **API RESTful**:
  - Back-end desenvolvido com Node.js e Express para gerenciar a lógica da aplicação.
  - Integração com o MongoDB para armazenamento de dados.

---

## 🛠️ **Tecnologias Utilizadas**

### **Front-End**
- React.js
- Axios (para chamadas à API)
- React Router (para navegação)
- Tailwind

### **Back-End**
- Node.js
- Express.js
- JSON Web Token (JWT) para autenticação
- Multer (para upload de imagens)

### **Banco de Dados**
- MongoDB (banco de dados NoSQL)

---

## 📂 **Estrutura do Projeto**

```plaintext
Travel-Story-App/
├── backend/
│   ├── config/
│   │   └── db.js         # Configuração do MongoDB
│   ├── controllers/
│   │   └── storyController.js # Lógica de negócios para histórias
│   ├── models/
│   │   ├── user.model.js # Modelo de usuário
│   │   └── story.model.js # Modelo de histórias
│   ├── routes/
│   │   └── storyRoutes.js # Rotas para histórias
│   └── server.js        # Inicialização do servidor Express
├── frontend/
│   ├── public/          # Arquivos públicos
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── App.js       # Componente principal
│   │   └── index.js     # Entrada da aplicação React
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências do projeto
└── README.md            # Documentação
```

--- 

# **🛠️ Como Configurar e Executar o Projeto** 

### Pré-requisitos

* Node.js (Versão >= 14.x)
* MongoDB configurado e rodando localmente.

## Passo a Passo

1. Clone este repositório.
```
git clone https://github.com/seu-usuario/Travel-Story-App.git
cd Travel-Story-App
```

2. Configura as variáveis de ambiente.
* Crie um arquivo `.env` no diretório `backend` e adicione:
```
PORT=8000
MONGO_URI=<sua-string-de-conexão-do-mongodb>
```

3. Instale as dependências no <b>backend</b> 

```
cd backend
npm install
```

4. Instale as dependências no <b>front-end:</b>

```
cd ../frontend
npm install

```

5. Inicie o servidor <b>back-end:</b>

```
cd ../backend
npm start
```

6. Inicie o servidor <b>front-end:</b>

```
cd ../frontend
npm run dev
```

7. Acesse a aplicação no navegador:
* Front-End: http://localhost:5173/

--- 

# **📋 Endpoints da API**
Usuários
POST /api/users/register - Cadastro de usuário.
POST /api/users/login - Login de usuário.
Histórias
GET /api/stories - Listar todas as histórias.
POST /api/stories - Criar nova história.
PUT /api/stories/:id - Editar história existente.
DELETE /api/stories/:id - Deletar história.
