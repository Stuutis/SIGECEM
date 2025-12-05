require('dotenv').config()
require('./database/db')

const express = require('express')
const cors = require('cors')

const doadoresRoutes = require('./routes/doadoresRoutes')
const authRoutes = require('./routes/authRoutes')
const familiasRoutes = require('./routes/familiasRoutes')
const campanhasRoutes = require('./routes/campanhasRoutes')
const beneficiariosRoutes = require('./routes/beneficiariosRoutes')

const verifyToken = require('./middleware/authMiddleware')

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send('API do SIGECEM está funcionando')
})
app.use('/api/auth', authRoutes)
app.use('/api/doadores', verifyToken, doadoresRoutes)
app.use('/api/familias', verifyToken, familiasRoutes)
app.use('/api/campanhas', verifyToken, campanhasRoutes)
app.use('/api/beneficiarios', verifyToken, beneficiariosRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})