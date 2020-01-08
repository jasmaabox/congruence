// auth.js
// User registration and login

const express = require('express');
const { body, check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { pool, passport, redirectAuth } = require('../config');

const router = express.Router();

router.route('/login')
    .get(redirectAuth, (_, res) => {
        res.render('login', { title: 'Login' });
    })
    .post([
        body('username')
            .trim()
            .escape(),
        body('password')
            .trim()
            .escape(),
    ],
        passport.authenticate('login-user', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
    );

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.route('/createAccount')
    .get(redirectAuth, (_, res) => {
        res.render('createAccount', { title: 'Create Account' });
    })
    .post([
        body('username')
            .trim()
            .escape(),
        body('password')
            .trim()
            .escape(),
        body('email')
            .trim()
            .escape(),
        body('confirm_password')
            .trim()
            .escape(),

        check('username')
            .not().isEmpty().withMessage('Username is required'),
        check('username')
            .custom((value, _) => {
                return pool.query(`SELECT * FROM users WHERE username=$1`, [value])
                    .then(results => {
                        if (results.rowCount > 0) {
                            return Promise.reject("Username already taken");
                        }
                    })
            }),
        check('email')
            .not().isEmpty().withMessage('Email is required'),
        check('email')
            .custom((value, _) => {
                return pool.query(`SELECT * FROM users WHERE email=$1`, [value])
                    .then(results => {
                        if (results.rowCount > 0) {
                            return Promise.reject("Email already in-use");
                        }
                    })
            }),
        check('password')
            .not().isEmpty().withMessage('Password is required'),
        check('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    ], (req, res) => {

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

        pool.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`, [username, email, hash], error => {
            if (!error) {
                res.redirect('/login');
            }
            else {
                res.render('createAccount', {
                    title: 'Create Account',
                    errors: ['Could not create account']
                });
            }
        });
    });

module.exports = router;