const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use('/static', express.static('static'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('home', {title: 'Home', message: 'hi there'});
});
app.get('/dummy', (req, res) => {
    axios.get("http://evaluator:8000/dummy")
        .then(response => {
            res.send({message: response.data});
        })
        .catch(error => {
            console.log(error);
        });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));