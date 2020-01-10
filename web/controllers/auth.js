// auth.js
// User registration and login

const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { pool, passport } = require('../config');
const { redirectAuth, cleanEntries, checkSignup } = require('../middleware');

const router = express.Router();

router.route('/login')
    .get(redirectAuth('/'), (_, res) => {
        res.render('login', { title: 'Login' });
    })
    .post(cleanEntries("username"),
        passport.authenticate('login-user', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
    );

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.route('/createAccount')
    .get(redirectAuth('/'), (_, res) => {
        res.render('createAccount', { title: 'Create Account' });
    })
    .post(cleanEntries("username", "email"), checkSignup(), (req, res) => {

        const { username, email, password } = req.body;

        // Form validation
        let errors = validationResult(req).array().map(({ msg }) => msg);
        if (errors.length > 0) {
            res.render('createAccount', {
                title: 'Create Account',
                errors: errors
            });
            return;
        }

        // Try to create user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        pool.query(
            `INSERT INTO users (username, email, password, verified_account, user_level, association_id)
            VALUES ($1, $2, $3, false, 0, 1)`,
            [username, email, hash],
            error => {
                if (!error) {
                    res.redirect('/login');
                }
                else {
                    res.render('createAccount', {
                        title: 'Create Account',
                        errors: [error]
                    });
                }
            });
    });

module.exports = router;