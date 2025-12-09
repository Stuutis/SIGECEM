const pool = require('../database/db');

const verifyAdmin = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT tipo FROM usuarios WHERE id_usuario = ?', [req.userId]);

        if (rows.length > 0 && rows[0].tipo === 'admin') {
            next(); // É admin, pode passar
        } else {
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar permissões.' });
    }
};
module.exports = verifyAdmin;