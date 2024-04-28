const express = require('express');
const auth = require('../../middleware/auth')
const dal = require('../../dal');
const { get } = require('lodash');
const router = express.Router();

router.post('/', auth, 
    async(req,res) => {
        try {
            const {team1, team2, date, venue} = req.body;
            if (team1 === null || team2 === null || date === null || venue === null) {
                return res.status(401).json({
                    status: 'Invalid data',
                    status_code: 401,
                });
            }

            await dal.query('BEGIN');

            const teams = get((await dal.query(
                `select * from teams where name = \'${team1}\' or name = \'${team2}\'`
                )), 'rows', {});
                

            if (teams.length !== 2) {
                await dal.query('ROLLBACK');
                return res.status(401).json({
                    status: 'Teams are invalid',
                    status_code: 401,
                });
            };

            const { rows } = await dal.query(
                `
                INSERT INTO public.match(
                    team_1, team_2, date, venue, status)
                    VALUES (\'${get(teams, '[0].name')}\', \'${get(teams, '[1].name')}\', \'${date}\',
                    \'${venue}\', 'pending') RETURNING *;
                `
            );

            await dal.query('COMMIT');

            return res.status(200).json({
                status: 'Match created successfully',
                match_id: get(rows, '[0].match_id'),
            });
        } catch (error) {
            return res.status(401).json({
                status: 'Player does not exist',
                status_code: 401,
            });
        }
    }
)

router.get('/', 
    async(req,res) => {
        try {
            await dal.query('BEGIN');

            const matches = get((await dal.query(
                `select * from match`
                )), 'rows', {});

            await dal.query('COMMIT');

            return res.status(200).json({
                matches: matches
            });
        } catch (error) {
            return res.status(401).json({
                status: 'Player does not exist',
                status_code: 401,
            });
        }
    }
)

router.get('/:match_id', 
    async(req,res) => {
        try {
            await dal.query('BEGIN');

            const matchId = req.params.match_id;

            const matches = get((await dal.query(
                `select * from match where match_id = ${matchId};`
                )), 'rows', {});

            const squad = {};
            for (let i = 1; i < 3; i++) {
                const team = get(matches, `[0].team_${i}`);
                squad[`team_${i}`] = get((await dal.query(
                    `
                    select t2p.player_id, p.name from teams t
                    JOIN team_to_player t2p on t2p.team_id = t.team_id
                    JOIN players p on p.player_id = t2p.player_id
                    where t.name = \'${team}\'
                    `
                    )), 'rows', {});

            }
            await dal.query('COMMIT');

            return res.status(200).json({
                match_id: matchId,
                team_1: get(matches, '[0].team_1'),
                team_2: get(matches, '[0].team_2'),
                date: get(matches, '[0].date'),
                venue: get(matches, '[0].venue'),
                status: get(matches, '[0].status'),
                squads: squad
            });
        } catch (error) {
            return res.status(401).json({
                status: 'Match does not exist',
                status_code: 401,
            });
        }
    }
)

module.exports = router;