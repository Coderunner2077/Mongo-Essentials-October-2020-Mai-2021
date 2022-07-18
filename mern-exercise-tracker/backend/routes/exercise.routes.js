const router = require('express').Router();
const exerciseCtrl = require('../controllers/exercise.controller');
const {verifyToken, verifyOwner } = require('../middleware');

router.route('/').get(exerciseCtrl.getAll);
router.post('/add', verifyToken, exerciseCtrl.addExercise);
router.get('/:id', exerciseCtrl.getOne);
router.delete('/:id', [verifyToken, verifyOwner.isOwnerOrMod], exerciseCtrl.deleteOne);
router.put('/update/:id', [verifyToken, verifyOwner.isOwnerOrMod], exerciseCtrl.updateOne);

module.exports = router;