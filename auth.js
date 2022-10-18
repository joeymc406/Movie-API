const jwtSecret = 'your_jwt_secret';
//same as the key used in the JWTStrategy..

const jwt = require('jsonwebtoken'),
passport = require('passport');

require('./passport');
//local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        // this is the username encoded in the jwt
        expiresIn: '7d',
        // specifies that the token will expire in 7 days
        algorithm: 'HS256'
        // algorithm used to "sign" or encode the values of the JWT
    });
}

// POST Login.
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is incorrect',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}