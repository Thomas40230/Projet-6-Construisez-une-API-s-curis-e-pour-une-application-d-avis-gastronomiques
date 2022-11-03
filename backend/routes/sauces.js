// routes = dossier qui contient la logique de nos routes (sauce.js)
const express = require('express');

// express.Router() permet de créer des routeurs séparés pour chaque route principale de notre application
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');
const checkSauceInput = require("../middleware/check-sauce-input")

router.get('/', auth, saucesCtrl.getAllSauces);  // Route GET pour récupérer toutes les sauces.
router.post('/', auth, multer, checkSauceInput, saucesCtrl.createSauce); // Route POST pour enregistrer une sauce.
router.get('/:id', auth, saucesCtrl.getOneSauce); // Route GET pour la récupérer une sauce.
router.put('/:id', auth, multer, checkSauceInput, saucesCtrl.modifySauce); // Route PUT pour modifier une sauce.
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Route DELETE pour supprimer une sauce.
router.post("/:id/like", auth, saucesCtrl.sauceLikes); // Route poste pour enregistrer l'ajout ou le retrait d'un like sur une sauce.

module.exports = router;
