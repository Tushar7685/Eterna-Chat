const multer = require("multer");

const storage = multer.memoryStorage();

exports.upload = multer({
  storage,
});
