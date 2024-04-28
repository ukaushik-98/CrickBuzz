const express = require('express');
const dal = require('../../dal');
const { get } = require('lodash');

const router = express.Router();

router.get('/:player_id/stats', 
    async (req,res) => {
        try {
            await dal.query('BEGIN');

            const player_id = req.params.player_id;

            const player = get((await dal.query(
                `select * from players where player_id = \'${player_id}\'`
                )), 'rows', {});
                

            if (player.length === 0) {
                await dal.query('ROLLBACK');
                return res.status(401).json({
                    status: 'Incorrect player_id provided. Please retry',
                    status_code: 401,
                });
            };

            await dal.query('COMMIT');

            return res.json({
                player_id: get(player, '[0].player_id'),
                name: get(player, '[0].name'),
                matches_played: get(player, '[0].matches_played'),
                runs: get(player, '[0].runs'),
                average: get(player, '[0].average'),
                strike_rate: get(player, '[0].strike_rate'),
            })

        } catch (error) {
            await dal.query('ROLLBACK');
            console.error(error.message);
            return res.status(401).json({
                status: 'Incorrect player_id provided. Please retry',
                status_code: 401,
            });
        }
    }
)

module.exports = router;