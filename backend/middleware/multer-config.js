const multer = require('multer'); // On importe le package multer de node.

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //split explose le nom en remplacant les expaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); //on ajoute au nom "date.now" pour que chaque fichier est un nom different
  }
});

module.exports = multer({storage: storage}).single('image');