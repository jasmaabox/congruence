const pool = require('./dbConfig');
const passport = require('./passportConfig');
const { redirectNonAuth, redirectAuth } = require('./helpers');

module.exports = {
    pool: pool,
    passport: passport,
    redirectNonAuth: redirectNonAuth,
    redirectAuth: redirectAuth,
}