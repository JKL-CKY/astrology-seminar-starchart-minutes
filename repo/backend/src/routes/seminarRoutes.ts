import * as express from 'express';
import * as multer from 'multer';
import {
  createSeminar,
  getSeminar,
  listSeminars,
  sendSeminarEmail,
  getChartData,
  generateDemoSeminar
} from '../controllers/seminarController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('audio'), createSeminar);
router.get('/demo', generateDemoSeminar);
router.get('/:id', getSeminar);
router.get('/', listSeminars);
router.post('/:id/send-email', sendSeminarEmail);
router.get('/chart/data', getChartData);

export default router;
