const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'swainmuleta';

function verifyToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status(403).json({ message: 'Nenhum token fornecido.' });
    }
    const token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token mal formatado.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Falha ao autenticar token.' });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;