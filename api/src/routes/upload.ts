/* eslint-disable no-console */
import { Request, Response, Router} from 'express';
import multer from 'multer';
import { ExifImage } from 'exif';

export interface AugmentedRequest extends Request {
  file?: {
    filename: string;
  };
}

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.route('/upload').post(upload.single('image'), (req: AugmentedRequest, res: Response) => {
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
  // res.send('File uploaded');
  res.redirect(`http://localhost:3001/images/${req.file.filename}`)
});

export { router };

