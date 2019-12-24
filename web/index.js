const express = require('express');
const { body, check, validationResult } = require('express-validator');
const axios = require('axios');
const qs = require('querystring');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { pool } = require('./config');


passport.use(new LocalStrategy(
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


const app = express();
const port = 3000;

// === Templating ===
app.use('/static', express.static('static'));
app.set('view engine', 'pug');

// === Middleware ===
app.use(require('morgan')('combined'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cors')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// === Routes ===
app.get('/', (req, res) => {
    res.render('home', { title: 'Home', message: 'hi there' });
});

app.route('/login')
    .get((_, res) => {
        res.render('login', { title: 'Login' });
    })
    .post([
        body('username')
            .trim()
            .escape(),
        body('password')
            .trim()
            .escape(),
        body('confirm_password')
            .trim()
            .escape(),
    ],
        passport.authenticate('local', { failureRedirect: '/login' }),
        (req, res) => {
            res.send("wow success");
        });

app.route('/createAccount')
    .get((_, res) => {
        res.render('createAccount', { title: 'Create Account' });
    })
    .post([
        body('username')
            .trim()
            .escape(),
        body('password')
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
                            return Promise.reject("User already exists");
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

        const { username, password } = req.body;

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

        pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hash], error => {
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


// Dummy pages
app.get('/dummy', (req, res) => {
    axios.get("http://evaluator:8000/dummy")
        .then(response => {
            res.send({ message: response.data });
        })
        .catch(error => {
            console.log(error);
        });
});
app.get('/dummy2', (req, res) => {
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
app.route('/dummy3')
    .get((req, res) => {
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

app.listen(port, () => console.log(`Starting web server on ${port}...`));