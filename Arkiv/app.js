require('dotenv').config();
const createError = require('http-errors');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authRout = require('./routes/auth')
var mongoose = require('mongoose');
var passportRouter = require('./routes/passport')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
require('./passport');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRout);
app.use('/api/passport', passportRouter);

app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
    if (err.name == 'MongoError' || err.name == "ValidationError" || err.name == 'CastError') {
        err.status = 422;
    }
    res.status(err.status || 500).json({ message: err.message || 'some error occurred' });
});



mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log('connected successfully');

});

module.exports = app;
