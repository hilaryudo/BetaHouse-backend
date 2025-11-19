const router   = require('express').Router();
const { signUp, signIn } = require('../controllers/authController');


router.post('/signUp', signUp);
router.post('/signIn', signIn);

module.exports = router;