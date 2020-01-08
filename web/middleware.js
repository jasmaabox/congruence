// middleware.js
// Middleware generator functions

const { body, check } = require('express-validator');
const { pool } = require('./config');

/**
 * Redirect if not authenticated
 * @param {*} url 
 */
const redirectNonAuth = (url) => (req, res, next) => {
    if (req.user) {
        return next();
    }
    else {
        res.redirect(url);
    }
}

/**
 * Redirect if authenticated
 * @param {*} url 
 */
const redirectAuth = (url) => (req, res, next) => {
    if (req.user) {
        res.redirect(url);
    }
    else {
        return next();
    }
}

/**
 * Verify user has high enough user level
 * @param {*} level 
 */
const verifyLevel = (level) => (req, res, next) => {
    if (req.user && req.user.user_level >= level) {
        next();
    }
    else {
        res.sendStatus(401);
    }
}

/**
 * Clean entries
 * @param  {...any} rest 
 */
const cleanEntries = (...rest) => {
    return rest.map((x)=>body(x).trim().escape());
}

/**
 * Check Sign-up fields
 */
const checkSignup = () => [
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
]

module.exports = {
    redirectNonAuth: redirectNonAuth,
    redirectAuth: redirectAuth,
    verifyLevel: verifyLevel,
    cleanEntries: cleanEntries,
    checkSignup: checkSignup,
}