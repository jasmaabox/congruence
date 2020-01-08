// passportConfig.js
// Sets up passport local authentication

const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./dbConfig');

passport.use('login-user', new LocalStrategy(
    (username, password, cb) => {
        pool.query('SELECT * FROM users WHERE username=$1', [username],
            (error, results) => {
                if (!error) {
                    if (results.rows.length > 0 && bcrypt.compareSync(password, results.rows[0].password)) {
                        return cb(null, results.rows[0]);
                    }
                    else {
                        return cb(null, false)
                    }
                }
                else {
                    return cb(error);
                }
            });
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    pool.query('SELECT * FROM users WHERE id=$1', [id], (error, results) => {
        if (error) {
            return cb(error);
        }
        cb(null, results.rows[0]);
    });
});

module.exports = passport;