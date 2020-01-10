// admin.js
// Admin routes

const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const { pool } = require('../config');
const { verifyLevel } = require('../middleware');

const router = express.Router();

router.get('/', verifyLevel(2), (req, res) => {
    res.render('admin/console', {
        title: 'Admin',
        user: req.user,
    });
});

router.get('/users', verifyLevel(2), (req, res) => {
});

router.get('/', verifyLevel(2), (req, res) => {

});

module.exports = router;