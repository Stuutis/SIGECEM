require('dotenv').config()
require('./database/db')

const express = require('express')
const cors = require('cors')

const doadoresRoutes = require('./routes/doadoresRoutes')
const authRoutes = require('./routes/authRoutes')
const familiasRoutes = require('./routes/familiasRoutes')
const campanhasRoutes = require('./routes/campanhasRoutes')
const categoriasRoutes = require('./routes/categoriasRoutes')
const produtosRoutes = require('./routes/produtosRoutes')
const entradasRoutes = require('./routes/entradasRoutes')
const distribuicaoRoutes = require('./routes/distribuicaoRoutes')
const relatoriosRoutes = require('./routes/relatoriosRoutes')

// Token
const verifyToken = require('./middleware/authMiddleware')

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send('API do SIGECEM está funcionando')
})
// Rotas publicas
app.use('/api/auth', authRoutes)

// Rotas Protegidas
app.use('/api/doadores', verifyToken, doadoresRoutes)
app.use('/api/familias', verifyToken, familiasRoutes)
app.use('/api/campanhas', verifyToken, campanhasRoutes)
app.use('/api/categorias', verifyToken, categoriasRoutes)
app.use('/api/estoque', verifyToken, produtosRoutes)
app.use('/api/entradas', verifyToken, entradasRoutes)
app.use('/api/distribuicao', verifyToken, distribuicaoRoutes)
app.use('/api/relatorios', verifyToken, relatoriosRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})