import multer from 'multer'

const MAXSIZE = 1024 * 1024 * 5

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png"
        || file.mimetype == "image/jpg" 
        || file.mimetype == "image/jpeg"
        || file.mimetype == "image/gif") {
        cb(null, true);
    } else {
        cb(null, false);
        cb(new Error('Only .png, .gif, .jpg and .jpeg format allowed!'));
    }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage, limits : { fileSize: MAXSIZE }, fileFilter : fileFilter }); 

export default upload