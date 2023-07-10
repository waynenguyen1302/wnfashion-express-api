var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');



// GET handler for login and logout
router.get('/login', userController.login);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

//POST handler for /register
router.post('/register', userController.createUser);

// GET handler for logout
// router.get('/logout', userController.logOut);

// GET user
router.get('/profile/:id', userController.getUserById);

//GET all users
router.get('/profiles', userController.getAllUsers);

//Edit user
router.put('/edit/:id', userController.editUser);

//DElete user
router.delete('/delete/:id', userController.deleteUser);


module.exports = router;
