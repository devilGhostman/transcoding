const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${uuid()}.${fileExtension}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /(mp4)/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: mp4 files Only!");
  }
}

const upload = multer({
  storage: storage,
  // limits: { fileSize: 204800 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
