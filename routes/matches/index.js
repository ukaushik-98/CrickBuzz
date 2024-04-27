const express = require('express');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/', auth, async(req,res) => {res.send('MATCHES ROUTE')})

// router.post('/matches', auth, (req,res) => {res.send('CREATING MATCHES')})

module.exports = router;