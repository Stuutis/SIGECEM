require('dotenv').config()
require('./database/db')
const doadoresRoutes = require('./routes/doadoresRoutes')

const express = require('express')
const cors = require('cors')

const app = express()

// middlewares
app.use(cors())
app.use(express.json())


// routes
app.get('/', (req, res) => {
    res.send('API do SIGECEM está funcionando')
})

app.use('/api/doadores', doadoresRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})