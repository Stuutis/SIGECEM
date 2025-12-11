const pool = require('../database/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.JWT_SECRET || 'swainmuleta'

const register = async (req, res) => {
    
    const { nome, email, senha } = req.body; 
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatorios (nome, email, senha).' });
    }
    
    try {
        
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {

            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
       
        const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
        const isFirstUser = countResult[0].total === 0;
        const tipoUsuario = isFirstUser ? 'admin' : 'voluntario';

    
        const query = `
            INSERT INTO usuarios 
            (nome, email, senha, tipo, matricula, setor, data_ingresso) 
            VALUES 
            (?, ?, ?, ?, NULL, NULL, NOW())
        `;
        
        await pool.query(query, [
            nome, 
            email, 
            hashedPassword, 
            tipoUsuario
        ]);

        res.status(201).json({ message: `Usuário cadastrado com sucesso como ${tipoUsuario}!` });
    } catch (error) {
        console.error('Erro no Registro:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatorios.' })
    }
    

    console.log(`\n--- Tentativa de Login para: ${email} ---`);

    try {
        
        const [users] = await pool.query(
            'SELECT id_usuario, nome, email, senha, tipo, data_saida FROM usuarios WHERE email = ? AND data_saida IS NULL', 
            [email]
        );
        
       
        console.log(`Consulta ao DB: ${users.length} usuário(s) encontrado(s).`);
        
        if (users.length === 0) {
        
            console.log('FALHA: Usuário não encontrado ou está inativo.');
            return res.status(401).json({ message: 'E-mail ou senha incorretos ou usuário inativo.' })
        }
        
        const user = users[0]
        

        const validPassword = await bcrypt.compare(senha, user.senha)
        
        console.log(`Comparação de Senha: ${validPassword ? 'SUCESSO' : 'FALHA'}.`);

        if (!validPassword) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos ou usuário inativo.' })
        }
 
        console.log(`Gerando Token para User ID: ${user.id_usuario} (Tipo: ${user.tipo})`);

        const token = jwt.sign(
            { id: user.id_usuario, email: user.email, tipo: user.tipo },
            SECRET_KEY,
            { expiresIn: '2h' }
        )

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: user.id_usuario,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo 
            }
        })
    } catch (error) {

        console.error('ERRO INESPERADO no Login:', error)
        res.status(500).json({ message: 'Erro ao fazer login.' })
    }
}

module.exports = { register, login }