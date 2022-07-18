const verifyToken = require('./verifyToken');
const verifySignUp = require('./verifySignUp');
const authRoles = require('./authRoles');
const verifyOwner = require('./verifyOwner');

module.exports = {
    verifyToken, verifySignUp, authRoles, verifyOwner
};