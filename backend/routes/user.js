// require pour importer le package express de node.
const express = require('express');

// express.Router() permet de créer des routeurs séparés pour chaque route principale de notre application
const router = express.Router();

// require pour importer les fonctions de notre controllers. 
const userCtrl = require('../controllers/user');

const password = require('../middleware/password'); // On importe le middleware password.
const email = require('../middleware/email');   // On importe le middleware email.


router.post('/signup', password, email, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;