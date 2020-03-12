/* eslint-disable no-console */
const express = require('express');
const multer = require('multer');
const ExifImage = require('exif').ExifImage;

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/upload').post(upload.single('image'), (req, res) => {
  // eslint-disable-next-line no-console
  console.log('req.file: ', req.file);
  try {
    const data = ExifImage(
      { image: `./uploads/${req.file.filename}` },
      (error, exifData) => {
        if (error) {
          console.log(`ERROR: ${error.message}`);
        } else {
          console.log(exifData);
        }
      }
    );
    console.log(data);
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
  }
  res.send('File uploaded');
});

module.exports = router;
