const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { verifyToken, authRoles } = require('../middleware');

router.route('/').get(controller.allAccess);
router.route('/users').get(verifyToken, controller.getUsers);
router.get('/user', verifyToken, controller.userBoard);
router.route("/user/:id").get(controller.getUser);
router.get('/mod', [verifyToken, authRoles.moderatorAccess], controller.moderatorBoard);
router.get('/admin', [verifyToken, authRoles.adminAccess], controller.adminBoard);

module.exports = router;