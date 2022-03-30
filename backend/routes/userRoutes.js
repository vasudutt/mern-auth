const router = require('express').Router();
const { createUser, signin, verifyEmail, forgotPassword, resetPassword } = require('../controllers/userController');
const { validateUser, validate } = require('../middleware/validate');
const { isResetTokenValid } = require('../middleware/user');


//router.post('/create', validateUser, validate, createUser);
router.post('/create', validate, createUser);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', isResetTokenValid, resetPassword);

module.exports = router;