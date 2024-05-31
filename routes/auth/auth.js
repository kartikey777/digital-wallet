const router = require('express').Router();
const { register, login, usersData } = require('../../controller/authentication/auth');
const userValidationMiddleware = require('../../middleware/userValidation');

router.post('/register', register);
router.post('/login', login);
router.get('/users' , userValidationMiddleware , usersData);

module.exports = router;