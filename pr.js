const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({
  dest: 'uploads/', // Destination directory for the uploaded files
  limits: {
    fileSize: 2 * 1024 * 1024 // Maximum file size is 2MB
  },
  fileFilter(req, file, cb) {
    // Allowed extensions for images, videos, and documents
    const allowedExtensions = ['jpg', 'jpeg', 'svg', 'png', 'mp4', 'pdf', 'docx', 'doc', 'xlsx'];
    if (!allowedExtensions.includes(file.originalname.split('.').pop())) {
      return cb(new Error('Invalid file extension'));
    }
    cb(null, true);
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ isUploaded: false, url: null });
  }
  res.send({ isUploaded: true, url: `/uploads/${req.file.filename}` });
});