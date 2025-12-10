const mysql = require('mysql2/promise')

require('dotenv').config()


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD (do .env):', process.env.DB_PASSWORD ? '********' : 'NÃO DEFINIDA OU VAZIA');
console.log('DB_NAME:', process.env.DB_NAME);


const dbPassword = process.env.DB_PASSWORD || ''; 
console.log('DB_PASSWORD (usada na conexão):', dbPassword ? '********' : 'VAZIA'); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: dbPassword, 
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

async function testConnection() {
    try {
        const connection = await pool.getConnection()
        console.log('Conexão com db bem sucedida!')
        connection.release()
    } catch (error) {
        console.error('Erro ao conectar ao db:', error.message)
        console.error('Detalhes do erro de conexão:', error);
    }
}

testConnection()

module.exports = pool;
