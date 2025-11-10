# SIGECEM - Sistema de Gerenciamento de Cestas Básicas [cite: 5]

]Este é um projeto acadêmico da disciplina de Engenharia de Software, com o objetivo de informatizar e otimizar o processo de controle de estoque de cestas básicas da ONG SEM FOME.

O sistema é uma aplicação Web Full-Stack, utilizando **React.js** para o front-end e **Node.js/Express** com **MySQL** para o back-end.

## 🚀 Principais Funcionalidades

O sistema permitirá o gerenciamento completo do fluxo de doações:

- Gerenciamento de Doadores (Pessoas Físicas e Jurídicas) 
- Gerenciamento de Famílias Beneficiadas 
- Gerenciamento de Voluntários e Funcionários
- Controle de Estoque de Produtos e Categorias 
- Registro de Entradas (Doações) 
- Registro de Saídas (Distribuição de Cestas)

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React.js
- **Back-end:** Node.js, Express.js
- **Banco de Dados:** MySQL
- **Gerenciamento de Pacotes:** NPM
- **Controle de Versão:** Git e GitHub

## ⚙️ Configuração do Ambiente de Desenvolvimento (Local)

Siga estes passos para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados:

- [Git](https://git-scm.com/)
- [Node.js (v18 ou superior)](https://nodejs.org/)
- Um servidor MySQL local (Recomendamos [MySQL Community Server](https://dev.mysql.com/downloads/mysql/))
- Um cliente de Banco de Dados (Recomendamos [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) ou DBeaver)

### 1. Clonando o Repositório

Primeiro, clone o repositório do GitHub para sua máquina:

```bash
git clone [https://github.com/Stuutis/SIGECEM.git](https://github.com/Stuutis/SIGECEM.git)
cd SIGECEM
```

2. Configurando o Back-end (Servidor)
   O servidor Node.js fica na pasta backend/.

Navegue até a pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure o Banco de Dados:

Abra o seu MySQL Workbench (ou cliente de preferência).

Crie o banco de dados que será usado pelo projeto:

```SQL

CREATE DATABASE sigecem;
```

Execute o script schema.sql para criar as tabelas. O arquivo está localizado em backend/src/database/schema.sql. (Copie o conteúdo dele e rode no seu Workbench dentro do banco sigecem).

Configure as Variáveis de Ambiente:

Crie um arquivo chamado .env dentro da pasta backend/.

Copie e cole o conteúdo abaixo no arquivo .env:

```bash
# Configuração do Servidor
PORT=4000
# Configuração do Banco de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=sigecem
Importante: Altere o valor sua_senha_do_mysql para a senha real do seu MySQL local.
```

3. Configurando o Front-end (Cliente)
   O cliente React fica na pasta raiz do projeto.

Navegue de volta para a raiz (se você estiver na pasta backend/):

```bash
cd ..
```

Instale as dependências:

```bash
npm install
```

▶️ Executando a Aplicação
Para executar o projeto, você precisará de dois terminais abertos.

Terminal 1: Executando o Back-end

```bash
# 1. Navegue até a pasta do back-end

cd backend

# 2. Inicie o servidor em modo de desenvolvimento

npm run dev
O servidor estará rodando em http://localhost:4000
```

Terminal 2: Executando o Front-end

```bash

# 1. (No outro terminal) Navegue até a pasta raiz

cd SIGECEM

# 2. Inicie o cliente React

npm start
A aplicação será aberta automaticamente no seu navegador em http://localhost:3000
```

👥 Autores
Christian Butkevicis Gomes

Isabela Aparecida Vilhoni Reche

João Marcelo da Cruz Constante

Lucas Alonso Ferreira Siqueira
