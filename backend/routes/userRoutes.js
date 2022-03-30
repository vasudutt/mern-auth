const router = require('express').Router();
const { createUser, signin } = require('../controllers/userController');
const { validateUser, validate } = require('../middleware/validate');


app.post('/create', validateUser, validate, createUser);
app.post('/signin', signin);

module.exports = router;