const express = require('express');

const app = express();
const port = 3000;

app.use('/static', express.static('static'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('home', {title: 'Home', message: 'hi there'});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));