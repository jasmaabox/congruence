// api.js
// API

const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config');
const { verifyLevel, cleanEntries } = require('../middleware');

const router = express.Router();

router.get('/user/all', verifyLevel(2), (_, res) => {
    pool.query('SELECT * from users', (error, results) => {
        if (!error) {
            res.json(results.rows);
        }
        else {
            res.sendStatus(500);
        }
    });
});

router.get('/user/:id', verifyLevel(2), (req, res) => {
    pool.query('SELECT * from users WHERE id=$1', [req.params.id], (error, results) => {
        if (!error) {
            if (results.rows[0]) {
                res.json(results.rows[0]);
            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(500);
        }
    });
});

router.post('/user/create', verifyLevel(2), cleanEntries("username", "email"), (req, res) => {

    const { username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    pool.query(
        `INSERT INTO users (username, email, password, verified_account, user_level, association_id)
        VALUES ($1, $2, $3, false, $4, $5, $6)`,
        [username, email, hash, 0, 1],
        error => {
            if (!error) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(500);
            }
        });
});

router.post('/user/update/:id', verifyLevel(2), (req, res) => {

    const id = req.params.id;
    const { username, email, password, user_level, enrolled_courses } = req.body;

    pool.query('SELECT * from users WHERE id=$1', id, (error, results) => {
        if (!error) {
            if (results.rows[0]) {
                // Prevent modification of higher-privileged user
                if (results.rows[0].user_level >= req.user.user_level) {
                    res.sendStatus(401);
                    return;
                }
            }
            else {
                res.sendStatus(404);
                return;
            }
        }
        else {
            res.sendStatus(500);
            return;
        }
    });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    pool.query(
        `UPDATE users
        SET username=$2, email=$3, password=$4, user_level=$5, enrolled_courses=$6
        WHERE id=$1`,
        [id, username, email, hash, user_level, enrolled_courses],
        error => {
            if (!error) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(500);
            }
        });
});

module.exports = router;