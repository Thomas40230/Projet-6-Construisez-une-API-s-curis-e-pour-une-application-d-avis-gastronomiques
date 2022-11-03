const passwordValidator = require('password-validator');    // On importe le package de password validator de node.

var schema = new passwordValidator();

// schema que doit respecter le mot de passe
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces

module.exports = (req, res, next) => {
    if(schema.validate(req.body.password)) {
        next()
    }else{
        return res.status(400).json({error : "Votre mot de passe doit contenir au moins 8 caractères dont une majuscule et un chiffre."})
    }
}