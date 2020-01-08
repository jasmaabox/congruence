// dummy.js
// Temporary dummy pages

const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const { pool } = require('../config');

const router = express.Router();

router.get('/dummy', (_, res) => {
    axios.get("http://evaluator:8000/dummy")
        .then(response => {
            res.send({ message: response.data });
        })
        .catch(error => {
            console.log(error);
        });
});

router.get('/dummy2', (_, res) => {
    axios.post("http://evaluator:8000/runCode", qs.stringify({
        lang: 'python',
        project_id: '12345',
    }))
        .then(response => {
            res.render('testResult', { title: 'Dummy2', ...response.data });
        })
        .catch(error => {
            console.log(error);
        });
});

router.route('/dummy3')
    .get((_, res) => {
        pool.query('SELECT * from users', (error, results) => {
            if (!error) {
                res.json({ status: 'success', message: results.rows })
            }
            else {
                res.json({ status: 'failure', message: error })
            }
        });
    })
    .post((req, res) => {
        const { username, password } = req.body;
        pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, password], error => {
            if (!error) {
                res.json({ status: 'success', message: `${username} added` })
            }
            else {
                res.json({ status: 'failure', message: error })
            }
        });
    });


module.exports = router;