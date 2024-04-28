const jwt = require('jsonwebtoken');
const { JWT } = require('../../../config');
const { get } = require('lodash');

async function createToken(user) {
    // Define payload for token
    const payload = {
        user: {
            username: get(user, '[0].username')
        }
    };

    return new Promise((resolve, reject) => {
            jwt.sign(payload, JWT.JWTSECRET, { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token);
                }
            )
        }
    );
}

module.exports = createToken;