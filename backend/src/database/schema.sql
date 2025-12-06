CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    matricula VARCHAR(20),
    setor VARCHAR(100),
    data_ingresso DATE,
    data_saida DATE,
    tipo ENUM('admin', 'voluntario') DEFAULT 'voluntario';
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doadores (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo_pessoa CHAR(1) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS familias (
    id_familia INT AUTO_INCREMENT PRIMARY KEY,
    nome_responsavel VARCHAR(255) NOT NULL, 
    endereco TEXT,
    contato VARCHAR(50),
    n_integrantes INT
);

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(255) NOT NULL,
    id_categoria INT,
    quantidade_estoque DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE IF NOT EXISTS campanhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data DATE,
    quantidade INT,
    foto VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS doacoes (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    id_usuario INT,
    data_doacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    FOREIGN KEY (id_doador) REFERENCES doadores(id_doador),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS itens_doacao (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_doacao INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_doacao) REFERENCES doacoes(id_doacao) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE IF NOT EXISTS distribuicoes (
    id_distribuicao INT AUTO_INCREMENT PRIMARY KEY,
    id_familia INT NOT NULL,
    id_usuario INT NOT NULL, 
    data_entrega DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_familia) REFERENCES familias(id_familia),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);


CREATE TABLE IF NOT EXISTS itens_distribuicao (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_distribuicao INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_distribuicao) REFERENCES distribuicoes(id_distribuicao) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE IF NOT EXISTS financeiro (
    id_lancamento INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL, 
    descricao VARCHAR(255) NOT NULL,        
    valor DECIMAL(10, 2) NOT NULL,
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT,                         
    id_doador INT,                          
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_doador) REFERENCES doadores(id_doador)
);
