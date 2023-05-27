const multer = require("multer");
const path = require("path");
const storage1 = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + req.user.uid + path.extname(file.originalname)
    );
  },
});
const storage2 = multer.diskStorage({
  destination: "./public/chats/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "_" +
        req.user.uid +
        new Date().getTime() +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage1 });
const uploadChat = multer({ storage: storage2 });

module.exports = { upload, uploadChat };
