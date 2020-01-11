// admin.js
// Admin routes

const express = require('express');
const qs = require('querystring');
const { pool } = require('../config');
const { verifyLevel } = require('../middleware');

const ENTRIES_PER_PAGE = 5;
const TABS_PER_PAGE = 3;
const router = express.Router();

router.get('/', verifyLevel(2), (req, res) => {
    res.render('admin/console', {
        title: 'Admin',
        user: req.user,
    });
});

router.get('/users', verifyLevel(2), (req, res) => {

    const page = req.query.page && Number.isInteger(parseInt(req.query.page))
        ? parseInt(req.query.page)
        : 1;

    Promise.all([
        pool.query(
            `SELECT COUNT(*) FROM users WHERE association_id=$1`,
            [req.user.association_id],
        ),
        pool.query(
            `SELECT * FROM users WHERE association_id=$1 AND id>$2 ORDER BY id ASC LIMIT $3`,
            [req.user.association_id, (page - 1) * ENTRIES_PER_PAGE, ENTRIES_PER_PAGE],
        ),
    ])
        .then((result) => {

            const totalCount = result[0].rows[0].count;
            const users = result[1].rows;

            // Prev and next
            const prev = page == 1 ? page : page - 1;
            const next = page * ENTRIES_PER_PAGE > totalCount ? page : page + 1;

            // Build tabs
            let tabs = [];
            if ((page + TABS_PER_PAGE) * ENTRIES_PER_PAGE < totalCount) {
                for (let i = 0; i < TABS_PER_PAGE; i++) {
                    tabs.push(page + i);
                }
            }
            else {
                const lastPage = Math.floor(totalCount / ENTRIES_PER_PAGE) + 1;
                for (let i = 0; i < TABS_PER_PAGE; i++) {
                    tabs.unshift(lastPage - i);
                }
            }

            res.render('admin/users', {
                title: 'Admin',
                user: req.user,
                users: users,
                curr_page: page,
                tabs: tabs,
                prev_href: `/admin/users?page=${prev}`,
                next_href: `/admin/users?page=${next}`,
            });
        })
        .catch((error) => {
            res.send(error);
        })
});

router.get('/courses', verifyLevel(2), (req, res) => {
    res.sendStatus(404);
});

module.exports = router;