const jwt = require('jsonwebtoken');
const admin = async (req, res, next) => {
    const token = req.header('access-token');
    if (!token) return res.status(401).json({ error: '¡Lo sentimos!, debes iniciar sesión para realizar la opción.' });
    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        if (verified.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
        }
        next();
    } catch (error) {
        res.status(400).json({ error: 'El token no es válido' });
    }
}
module.exports = admin;
