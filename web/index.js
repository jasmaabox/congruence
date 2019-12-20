const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express();
const port = 3000;

app.use('/static', express.static('static'));
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.render('home', { title: 'Home', message: 'hi there' });
});
app.route('/login')
    .get((req, res) => {
        res.render('login', { title: 'Login' });
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
        })
    })
    .post((req, res) => {
        const { username, password } = req.body;
        pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], error => {
            if (!error) {
                res.json({ status: 'success', message: `${username} added` })
            }
            else {
                res.json({ status: 'failure', message: error })
            }
        });
    });

app.listen(port, () => console.log(`Starting web server on ${port}...`));