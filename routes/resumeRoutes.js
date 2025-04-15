
// import express from 'express';
// import multer from 'multer';
// import { uploadResumeAndAnalyze } from '../controllers/resumeController.js';

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// router.post('/upload', upload.single('resume'), uploadResumeAndAnalyze);

// export default router;


// server/routes/resumeRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadResumeAndAnalyze } from '../controllers/resumeController.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// 👇 'resume' must match the field name in Postman
router.post('/upload', upload.single('resume'), uploadResumeAndAnalyze);

export default router;
