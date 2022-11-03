// on importe le package mongoose
const mongoose = require('mongoose');

// On rajoute ce validateur comme plugin à notre shéma
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// On applique ce validator à notre schéma avant d'en faire un model
userSchema.plugin(uniqueValidator);

// Pour exploiter ce schéma comme model on utilise la méthode du package mongoose 'models'
module.exports = mongoose.model('User', userSchema);