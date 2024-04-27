const decryptToken = require('./jwtAuthDecryptor');

module.exports.function =  (req, res, next) => {
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