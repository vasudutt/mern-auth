const router = require('express').Router();
const { createUser, signin, verifyEmail } = require('../controllers/userController');
const { validateUser, validate } = require('../middleware/validate');


//router.post('/create', validateUser, validate, createUser);
router.post('/create', validate, createUser);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);

module.exports = router;