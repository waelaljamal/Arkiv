const User = require('./models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
},
    function (email, password, cb) {
        return User.findOne({ email: email, password: password })
            .then(user => {
                if (!user) return cb(null, false, { message: 'Incorrect email or password' });
                return cb(null, user, { message: 'logged in successfully' });
            })
            .catch(err => {
                cb(err)
            })
    }
));

passport.use(new JWTstrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, function (jwtPayload, cb) {
    let data = {
        id: jwtPayload.id,
        name: jwtPayload.name,
        email: jwtPayload.email
    };
    cb(null, data);
}
));