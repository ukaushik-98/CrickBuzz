const jwt = require('jsonwebtoken');
const { get, has } = require('lodash');
const { JWT } = require('../../config');

function decryptToken(token) {
    if (!token) {
        throw new Error('Missing token');
    }

    const bearer = token.split(' ');

    if (get(bearer, '[0]', '') !== 'Bearer') {
        throw new Error('Invalid token format');
    }

    const decoded = jwt.verify(get(bearer, '[1]', ''), JWT.JWTSECRET);

    if (!has(decoded, 'user')) {
        throw new Error('Failed to fetch user');
    }

    return get(decoded, 'user');
}

module.exports = decryptToken;