// admin.js
// Admin routes

const express = require('express');
const qs = require('querystring');
const { pool } = require('../config');
const { verifyLevel } = require('../middleware');

const PAGE_COUNT = 5;
const router = express.Router();

router.get('/', verifyLevel(2), (req, res) => {
    res.render('admin/console', {
        title: 'Admin',
        user: req.user,
    });
});

router.get('/users', verifyLevel(2), (req, res) => {

    const cursor = req.query.cursor && Number.isInteger(parseInt(req.query.cursor))
        ? parseInt(req.query.cursor)
        : 0;

    pool.query(
        `SELECT * FROM users WHERE association_id=$1 AND id>$2 ORDER BY id ASC LIMIT $3`,
        [req.user.association_id, cursor * PAGE_COUNT, PAGE_COUNT],
    )
        .then((result) => {

            // Prev and next
            const prev = cursor == 0 ? 0 : cursor - 1;
            const next = cursor + 1;

            res.render('admin/users', {
                title: 'Admin',
                user: req.user,
                users: result.rows,
                prev_href: `/admin/users?cursor=${prev}`,
                next_href: `/admin/users?cursor=${next}`,
            });
        })
        .catch((error) => {
            res.send(error);
        })
});

router.get('/', verifyLevel(2), (req, res) => {

});

module.exports = router;