const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {res.send('PLAYERS ROUTE')})

module.exports = router;