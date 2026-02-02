const multer = require('multer');
const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const AppError = require('../utils/appError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder = 'natours-app';
    let publicId = `file-${Date.now()}`;
    let transformation = []

    if (req.baseUrl.includes('users') || req.path.includes('me')) {
      folder = 'natours-app/users';
      publicId = `user-${req.user.id}-${Date.now()}`;
      transformation = [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    }

    if (req.baseUrl.includes('tours')) {
      folder = 'natours-app/tours';
      publicId = `tour-${req.params.slug}-${Date.now()}`;
    }

    return {
      folder: folder,
      public_id: publicId,
      transformation: transformation
    }
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.!', httpStatus.BAD_REQUEST), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

