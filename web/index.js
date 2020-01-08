// index.js
// Main routes

const express = require('express');
const { passport } = require('./config');


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
    if (req.user) {
        if (req.user.user_level >= 2) {
            res.render('adminConsole',
                { title: 'Admin', user: req.user }
            );
        }
        else {
            res.render('profile', {
                title: 'Home',
                user: req.user
            });
        }
    }
    else {
        res.render('home', { title: 'Home' });
    }
});

app.use('/', require('./controllers/auth'));
app.use('/', require('./controllers/dummy'));
app.use('/', require('./controllers/admin'));
app.use('/api/v1', require('./controllers/api'));

app.listen(port, () => console.log(`Starting web server on ${port}...`));