const createErorr = require('http-errors'),
    jwt = require('jsonwebtoken'),
    User = require('../models/users');


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email, password: req.body.password })
        .then(user => {
            if (!user) throw createErorr(401, 'Incorrect email or password');
            let data = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            let token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({ token: token });
        })
}
exports.me = (req, res, next) => {
    res.json(req.user)
};