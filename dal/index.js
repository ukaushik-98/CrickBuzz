const { Pool } = require('pg');
const config = require('../config');
const pool = new Pool(config.DB_CONFIG);

//Export query function -> will be used to launch queries everywhere!
module.exports = {
    query: (text, params, callback) => {return pool.query(text, params, callback)}
}