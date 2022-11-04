let textRegExp = /[\^=<>{}]+/mi;

module.exports = (req, res, next) => {
    // Si il s'agit de la route post
    if (JSON.parse(req.body.sauce !== undefined)) {
      const sauce = JSON.parse(req.body.sauce);
      let { name, manufacturer, description, mainPepper } = sauce;
      let trimedTab = [];
  
      function toTrim(...string) {
        trimedTab = string.map((elt) => elt.trim());
      }
      toTrim(name, manufacturer, description, mainPepper);
      
      Object.values(sauce).forEach(value => {
        if (textRegExp.test(value)) {
          throw new Error("Caractere interdit")
        }
      });
  
      // Vérification du nombre de caractères après avoir trim()
      const hasThreeCharacters = (currentValue) => currentValue.length >= 3;
      if (trimedTab.every(hasThreeCharacters)) {
        next();
      } else {
        throw new Error("Tous les champs doivent faire au moins 3 caractères");
      }
    } else {
      // Si il s'agit de la route put
      const sauce = req.body;
      let { name, manufacturer, description, mainPepper } = sauce;
      let trimedTab = [];
  
      function toTrim(...string) {
        trimedTab = string.map((elt) => elt.trim());
      }
      toTrim(name, manufacturer, description, mainPepper);

      Object.values(sauce).forEach(value => {
        if (textRegExp.test(value)) {
          throw new Error("Caractere interdit")
        }
      });
      
      // Vérification du nombre de caractères après avoir trim()
      const hasThreeCharacters = (currentValue) => currentValue.length >= 3;
      if (trimedTab.every(hasThreeCharacters)) {
        next();
      } else {
        throw new Error("Tous les champs doivent faire au moins 3 caractères");
      }
    }
  };