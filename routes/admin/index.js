const express = require('express');
const {check, validationResult } = require('express-validator');
const { get } = require('lodash');
const dal = require('../../dal');
const createToken = require('../../middleware/auth/generator/jwtTokenGenerator')

const router = express.Router();

router.post('/signup', [
        // Express inbuilt validation
        check('email', 'Not a valid email').isEmail(),
        check('username', 'Not a valid username').isLength({min: 1}),
        check('password', 'Enter a password with 6 or more characters').isLength({min: 6})
    ],
    async(req,res) => {
        const err = validationResult(req);  //check if validation failed

        if (!err.isEmpty()) {
            return res.status(400).json({errors: err.array()});
        }

        try {
            await dal.query('BEGIN');

            const {email, password, username} = req.body;

            const user = get((await dal.query(`select * from admins where email = \'${email}\'`)), 'rows', {});

            if (user.length > 0) {
                await dal.query('ROLLBACK');
                return res.status(400).json({ errors: [ {msg: 'User already exists'}]})
            };

            // Create new user
            const {rows} = await dal.query(
                `
                    insert into admins (email, username, password) 
                    values(\'${email}\',\'${username}\',\'${password}\') RETURNING *
                `
            );

            await dal.query('COMMIT');

            return res.json({
                status: 'Admin account successfully created',
                status_code: 200,
                user_id: get(rows, '[0].user_id')
            })

        } catch (error) {
            await dal.query('ROLLBACK');
            console.error(error.message);
            return res.status(500).json({ msg: 'Server error' });
        }
    }
);

router.post('/login',
    async(req, res) => {
        const err = validationResult(req);  //check if validation failed

        if (!err.isEmpty()) {
            return res.status(400).json({errors: err.array()});
        }

        try {
            await dal.query('BEGIN');

            const {username, password} = req.body;

            const user = get((await dal.query(
                `select * from admins where username = \'${username}\' and password = \'${password}\'`
                )), 'rows', {});
                

            if (user.length === 0) {
                await dal.query('ROLLBACK');
                return res.status(401).json({
                    status: 'Incorrect username/password provided. Please retry',
                    status_code: 401,
                });
            };

            await dal.query('COMMIT');

            const token = await createToken(user);

            return res.json({
                status: 'Login successful',
                status_code: 200,
                user_id: get(user, '[0].user_id'),
                access_token: token
            })

        } catch (error) {
            await dal.query('ROLLBACK');
            console.error(error.message);
            return res.status(401).json({
                status: 'Incorrect username/password provided. Please retry',
                status_code: 401,
            });
        }
    }
);

module.exports = router;