var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var jwt = require('jsonwebtoken');
var passport = require('passport');

router.post('/', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) return next(createError(401));
        req.login(user, { session: false }, err => {
            if (err) return next(createError(500));
            let userData = {
                id: user._id,
                name: user.name,
                email: user.email
            };
            let token = jwt.sign(userData, process.nev.JWT_SECRET);
            res.json({ token: token });
        });
    })(req, res);
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json(req.user)
});


module.exports = router;