// controllers contient la logique métier qui est appliquer à chaques routes.

const Sauce = require('../models/sauce');
const fs = require('fs');
const User = require('../models/user');

// Ici on viens créer une instance de notre modèle 'sauce' en lui passant un objet
exports.createSauce = (req, res, next) => {
  const saucesData = JSON.parse(req.body.sauce);
  delete saucesData._id;
  delete saucesData._userId;
  const sauce = new Sauce({
      ...saucesData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

// Méthode findOne() pour trouver un seul objet, on compare l'id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
    }).then(
    (oneSauce) => {
      res.status(200).json(oneSauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Méthode updateOne() pour mettre à jour, modifier une sauce dans la base de donnée.
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({message: 'Non autorisé'});
  } else {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
      const sauceObject = req.file ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
      : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    };
  });
};

// Méthode deleteOne() pour supprimer une sauce dans la base de données.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Non autorisé'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// Méthode find() pour renvoyer un tableau contenant toute les sauces de la base de donnée.
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Partie Like & Dislike d'une sauce

exports.sauceLikes = (req, res, next) => {
  let sauceId = req.params.id
  let userId = req.body.userId 
  let like = req.body.like
  
  switch(like) { 
// L'instruction switch évalue une expression et, selon le résultat obtenu et le cas associé, exécute les instructions correspondantes.
// Si like = 1, l'utilisateur aime (= likes)
 
      case 1 : 
      Sauce.updateOne(
          { _id: sauceId }, 
          {
              $push : { usersLiked: userId }, 
              $inc : { likes: +1 } 
          }
      )  
          .then(() => res.status(200).json({message: "J'aime"}))
          .catch((error) => res.status(400).json({ error }));

  break;
// Si like = 0, l'utilisateur annule son like ou son dislike
      case 0 :
      Sauce.findOne(
          { _id: sauceId }
      )
      .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
              Sauce.updateOne(
                  { _id: sauceId },
                  {
                      $pull: { usersLiked: userId },
                      $inc: { likes: -1 }
                  }
              )
                  .then(() => res.status(200).json({message: "Unliked"}))
                  .catch((error) => res.status(400).json({ error }))
          }
          if (sauce.usersDisliked.includes(userId)) {
              Sauce.updateOne(
                  { _id: sauceId },
                  {
                      $pull: { usersDisliked: userId },
                      $inc: { dislikes: -1 }
                  }
              )
              .then(() => res.status(200).json({message: "Undisliked"}))
              .catch((error) => res.status(400).json({ error }))
          }
      })
      .catch((error) => res.status(404).json({ error }))
  
  break;
// Si like = -1, l'utilisateur n'aime pas (= dislikes)  

  case -1 :
      Sauce.updateOne(
          { _id: sauceId }, 
          {
              $push : { usersDisliked: userId },
              $inc : { dislikes: +1 }
          }
      )  
      .then(() => res.status(200).json({message: "Je n'aime pas"}))
      .catch((error) => res.status(400).json({ error }));
  
  break;
  }
};