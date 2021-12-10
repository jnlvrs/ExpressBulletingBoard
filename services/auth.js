const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');


var authService = {
    signUser: function (user) {
        const token = jwt.sign({
            UserName: user.UserName,
            UserId: user.UserId,
            Admin: user.Admin
        }, 'secretKey',
            {
                expiresIn: '1h'
            }
        );
        return token;
    },

    verifyUser: function (token) {
        try {
            let decoded = jwt.verify(token, 'secretKey');
            return models.users.findByPk(decoded.UserId);
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    hashPassword: function (plainTextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash
    },

    comparePasswords: function (plainTextPassword, hashPassword) {
        return bcrypt.compareSync(plainTextPassword, hashPassword)
    }
}

module.exports = authService;