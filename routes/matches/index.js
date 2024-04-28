const express = require('express');
const auth = require('../../middleware/auth');

const router = express.Router();


router.post('/matches', auth, 
    async(req,res) => {
        
    }
)

module.exports = router;