var express = require('express');
const createHttpError = require('http-errors');
const { DocumentProvider } = require('mongoose');
var router = express.Router();
const controller = require('../controllers/authController'),
    jtw = require('jsonwebtoken'),
    createError = require('http-errors');

const authMiddleware = (req, res, next) => {
    let tocken = req.headers['authorization'];
    jtw.verify(tocken, process.env.JWT_SECRET, (err, decode) => {
        if (err) throw createError(401);
        req.user = {
            id: decode.id,
            name: decode.name,
            email: decode.email
        };
        next();
    });
}

router.post('/', controller.login);
router.get('/me', authMiddleware, controller.me);

module.exports = router;
