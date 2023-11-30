const multer = require("multer");

const fileFilter = (req, file, callback) => {
  if (
    ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
      file.mimetype
    )
  ) {
    callback(null, true);
  } else {
    const error = new Error("Not a valid format");
    error.status = 400;
    callback(error, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, process.env.IMAGE_DESTINATION);
  },
  filename: (req, file, callback) => {
    const [originalName, fileExtension] = file.originalname.split(".")
    callback(null, originalName + "_" + Date.now().toString() + "." + fileExtension);
  },
});
const upload = multer({
  storage,
  fileFilter,
}).any();

const uploadImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("upload Image multer error>> ", err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.log("upload Image error>> ", err);
      return res.status(err.status || 500).json({ message: err.message });
    }
    next();
  });
};

module.exports = { uploadImage };
