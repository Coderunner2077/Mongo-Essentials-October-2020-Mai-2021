const { authJwt } = require('../middlewares');
const controller = require('../controllers/user.controller');
const router = require('express').Router();

router.get('/all', controller.allAccess);
router.get('/user', authJwt.verifyToken, controller.userBoard);
router.get('/moderator', [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);
router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

module.exports = router;
