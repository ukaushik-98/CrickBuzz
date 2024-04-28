const decryptToken = require('./decryptor/jwtAuthDecryptor');

function authMiddleWare(req, res, next) {
    const token = req.header('Authorization');

    try {
        req.user = decryptToken(token);
        next();
    } catch (error) {
        res.status(401).json({
            status: 'Authorization failed',
            status_code: 401
        });
    }
} 

module.exports = authMiddleWare;