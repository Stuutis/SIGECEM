const pool = require('../database/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.JWT_SECRET || 'swainmuleta'

const register = async (req, res) => {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatorios' })
    }
    try {
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)'
        await pool.query(query, [nome, email, hashedPassword])

        res.status(201).json({ message: 'Usuario cadastrado com sucesso!' })
    } catch (error) {
        console.error('Erro no Registro:', error)
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' })
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatorios.' })
    }

    try {
        const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
        if (users.length === 0) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos' })
        }
        const user = users[0]
        const validPassword = await bcrypt.compare(senha, user.senha)

        if (!validPassword) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' })
        }

        const token = jwt.sign(
            { id: user.id_usuario, email: user.email },
            SECRET_KEY,
            { expiresIn: '2h' }
        )

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: user.id_usuario,
                nome: user.nome,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Erro no Login:', error)
        res.status(500).json({ message: 'Erro ao fazer login.' })
    }
}

module.exports = { register, login }