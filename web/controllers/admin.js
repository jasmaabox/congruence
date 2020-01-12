// admin.js
// Admin routes

const express = require('express');
const qs = require('querystring');
const { pool } = require('../config');
const { verifyLevel } = require('../middleware');

const ENTRIES_PER_PAGE = 5;
const TABS_PER_PAGE = 3;
const router = express.Router();

/**
 * Generates listing of table entries
 * 
 * @param {*} tableName Table to generate
 * @param {*} summarize Function converting entry to string summary
 */
const generateListing = (tableName, summarize) => (req, res) => {

    const page = req.query.page && Number.isInteger(parseInt(req.query.page))
        ? parseInt(req.query.page)
        : 1;

    // NOTE: sql injection possible from table name
    Promise.all([
        pool.query(
            `SELECT COUNT(*) FROM ${tableName} WHERE association_id=$1`,
            [req.user.association_id],
        ),
        pool.query(
            `SELECT * FROM ${tableName} WHERE association_id=$1 AND id>$2 ORDER BY id ASC LIMIT $3`,
            [req.user.association_id, (page - 1) * ENTRIES_PER_PAGE, ENTRIES_PER_PAGE],
        ),
    ])
        .then((result) => {

            const totalCount = result[0].rows[0].count;
            const entries = result[1].rows;

            // Prev and next
            const lastPage = Math.floor(totalCount / ENTRIES_PER_PAGE) + 1;
            const prev = page <= 1 ? 1 : page - 1;
            const next = page * ENTRIES_PER_PAGE > totalCount ? lastPage : page + 1;

            // Build tabs
            let tabs = [];
            if (totalCount >= TABS_PER_PAGE * ENTRIES_PER_PAGE) {
                if ((page + TABS_PER_PAGE) * ENTRIES_PER_PAGE < totalCount) {
                    for (let i = 0; i < TABS_PER_PAGE; i++) {
                        tabs.push(page + i);
                    }
                }
                else {
                    for (let i = 0; i < TABS_PER_PAGE; i++) {
                        tabs.unshift(lastPage - i);
                    }
                }
            }
            else {
                for (let i = 1; i <= lastPage; i++) {
                    tabs.push(i);
                }
            }

            res.render('admin/listing', {
                title: 'Admin',
                user: req.user,
                tableName: tableName,
                entries: entries.map(x => summarize(x)),
                curr_page: page,
                tabs: tabs,
                prev_href: `/admin/${tableName}?page=${prev}`,
                next_href: `/admin/${tableName}?page=${next}`,
            });
        })
        .catch((error) => {
            res.send(error);
        });
}

router.get('/', verifyLevel(2), (req, res) => {
    res.render('admin/console', {
        title: 'Admin',
        user: req.user,
    });
});

router.get('/users', verifyLevel(2),
    generateListing(
        'users',
        entry => `(id=${entry.id}, username=${entry.username})`
    )
);
router.get('/courses', verifyLevel(2),
    generateListing(
        'courses',
        entry => `(id=${entry.id}, course_name=${entry.course_name})`
    )
);

module.exports = router;