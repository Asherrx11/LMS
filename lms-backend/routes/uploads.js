const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') // make sure this uploads directory exists
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Route to handle file uploads
router.post('/file', upload.single('file'), (req, res) => {
  try {
    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading file', error: error.message });
  }
});

module.exports = router;
