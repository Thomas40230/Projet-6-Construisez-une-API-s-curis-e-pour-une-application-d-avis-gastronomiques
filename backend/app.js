// require pour importer le package express de node.
const express = require('express');

// require pour importer le package mongoose.
const mongoose = require('mongoose');
const sauce = require('./models/sauce');
const path = require('path');
const app = express();
const helmet = require('helmet');
require('dotenv').config();
const rateLimit = require("express-rate-limit"); // Limiteur de connexion 

// définition des caractéristiques du limiteur de tentative connexion
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
	max: 10, // Limite chaque IP à 10 connexions max par fenêtre de 15 minutes
	standardHeaders: true, // Retourne la limitation dans le header `RateLimit-*`
	legacyHeaders: false, // désactive les headers `X-RateLimit-*`
});

// require pour importer les routes ( des sauces, et des users)
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Utilisation de la méthode 'mongoose.connect' pour se connecter à MongoDB.
mongoose.connect(process.env.MONGOOSE_PASSWORD,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Pour cette route la '/api/sauces' on utilise le routeur saucesRoutes
app.use('/api/sauces', saucesRoutes);

// Pour cette route la '/api/auth' on utilise le routeur usersRoutes
app.use('/api/auth', userRoutes, limiter);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
