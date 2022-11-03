// require pour importer le package bcrypt de node.
const bcrypt = require('bcrypt');
// require pour importer le package json web token de node.
const jwt = require('jsonwebtoken');
// require vient importer les models user.js
const User = require('../models/user');

// "hash" permet le cryptage/hash d'un mot de passe.
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

/** La méthode '.compare' de bcrypt compare un string avec un hash pour vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé 
enregistré en base de données */ 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // La fonction '.sign()' de jsonwebtoken utilise une clé secrète pour chiffrer un token
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )        
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};