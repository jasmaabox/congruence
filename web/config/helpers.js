// helpers.js
// Helper functions

const redirectNonAuth = (req, res, next) => {
    if (req.user) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}

const redirectAuth = (req, res, next) => {
    if (req.user) {
        res.redirect('/');
    }
    else {
        return next();
    }
}

module.exports = {
    redirectNonAuth: redirectNonAuth,
    redirectAuth: redirectAuth,
}