require('dotenv').config()

require('./database/db')

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API do SIGECEM está funcionando')
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

