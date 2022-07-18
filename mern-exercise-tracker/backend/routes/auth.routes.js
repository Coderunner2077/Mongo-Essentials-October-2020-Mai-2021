const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyToken, authRoles, verifySignUp } = require('../middleware');

router.post('/signup', 
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExist],
    controller.signup
);

router.route('/signin').post(controller.signin);
router.put('/update/:id', [verifyToken, authRoles.verifyUpdateDeleteAccessAdmin], controller.update);
router.delete('/delete/:id', [verifyToken, authRoles.verifyUpdateDeleteAccessAdmin], controller.delete);

module.exports = router;