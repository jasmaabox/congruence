// admin.js
// Admin routes

const express = require('express');
const { pool } = require('../config');
const { verifyLevel } = require('../middleware');

const ENTRIES_PER_PAGE = 5;
const TABS_PER_PAGE = 3;
const router = express.Router();

/**
 * Generates listing of table entries
 * 
 * @param {*} tableName Table to generate for
 * @param {*} summarize Function converting entry to string summary
 */
const generateListing = (tableName, summarize) => (req, res) => {

    let page = req.query.page && Number.isInteger(parseInt(req.query.page))
        ? parseInt(req.query.page)
        : 1;
    let totalCount = -1;
    let lastPage = 1;

    // NOTE: sql injection possible from table name
    pool.query(
        `SELECT COUNT(*) FROM ${tableName} WHERE association_id=$1`,
        [req.user.association_id],
    )
        .then(result => new Promise((resolve, _) => {
            totalCount = result.rows[0].count;
            lastPage = Math.ceil(totalCount / ENTRIES_PER_PAGE);

            page = Math.max(1, Math.min(lastPage, page));

            resolve();
        }))
        .then(_ => pool.query(
            `SELECT * FROM ${tableName} WHERE association_id=$1 AND id>$2 ORDER BY id ASC LIMIT $3`,
            [req.user.association_id, (page - 1) * ENTRIES_PER_PAGE, ENTRIES_PER_PAGE],
        ))
        .then(result => {

            const entries = result.rows;

            const prev = page <= 1 ? 1 : page - 1;
            const next = page >= lastPage ? lastPage : page + 1;

            // Build pagination tabs
            let tabs = [];
            if (totalCount >= TABS_PER_PAGE * ENTRIES_PER_PAGE) {
                if ((page + TABS_PER_PAGE - 1) * ENTRIES_PER_PAGE <= totalCount) {
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

/**
 * Generates page for editing entry
 * 
 * @param {*} tableName Table to generate for
 * @param {*} action Submit action
 * @param {*} blacklist Blacklisted fields
 */
const generateEditing = (tableName, action, blacklist = []) => (req, res) => {
    pool.query(
        `SELECT column_name,data_type FROM information_schema.columns WHERE table_name=$1`,
        [tableName],
    )
        .then((result) => {

            const fields = result.rows.filter(x => !blacklist.includes(x.column_name));

            res.render('admin/editing', {
                title: 'Admin',
                user: req.user,
                action: action,
                tableName: tableName,
                fields: fields,
            });
        });
}

router.get('/', verifyLevel(2), (req, res) => {
    res.render('admin/console', {
        title: 'Admin',
        user: req.user,
    });
});


// === Routes ===
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

router.route('/users/new')
    .get(verifyLevel(2),
        generateEditing('users', '/admin/users/new', ['association_id']),
    )
    .post(verifyLevel(2), (req, res) => {
        const { id, username, password, email, verified_account, user_level } = req.body;
        pool.query(
            `INSERT INTO users (id, association_id, username, password, email, verified_account, user_level)
            VALUES($1, $2, $3, $4, $5, $6, $7)`,
            [id, req.user.association_id, username, password, email, verified_account, user_level],
        )
            .then(result => {
                res.redirect('/admin');
            })
    });
router.route('/courses/new')
    .get(verifyLevel(2),
        generateEditing('courses', '#', ['association_id']),
    );

module.exports = router;