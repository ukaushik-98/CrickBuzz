const express = require('express');
const auth = require('../../middleware/auth')
const dal = require('../../dal');
const { get } = require('lodash');

const router = express.Router();

router.post('/:team_id/squad', auth, 
    async (req,res) => {
        try {
            const teamId = req.params.team_id;
            const {name, role} = req.body;
            if (name === null || role === null) {
                return res.status(401).json({
                    status: 'Player does not exist',
                    status_code: 401,
                });
            }

            await dal.query('BEGIN');

            const player = get((await dal.query(
                `select * from players where name = \'${name}\'`
                )), 'rows', {});
                

            if (player.length === 0) {
                await dal.query('ROLLBACK');
                return res.status(401).json({
                    status: 'Adding player to team failed',
                    status_code: 401,
                });
            };

            const playerId = get(player, '[0].player_id');

            // Create new user
            await dal.query(
                `
                    insert into team_to_player (team_id, player_id, player_role) 
                    values(\'${teamId}\',\'${playerId}\',\'${role}\') RETURNING *
                `
            );

            await dal.query('COMMIT');

            return res.status(200).json({
                status: 'Player added to squad successfully',
                player_id: playerId,
            });
        } catch (error) {
            return res.status(401).json({
                status: 'Player does not exist',
                status_code: 401,
            });
        }
    }
);

module.exports = router;