// admin.js
// Admin routes

const express = require('express');
const { body, check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { pool, passport, redirectAuth } = require('../config');

const router = express.Router();