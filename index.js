const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const maxSize = 2 * 1024 * 1024; 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now()+'.'+file.originalname.split('.').pop()
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype)
    
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"||
      file.mimetype == "image/svg+xml"||
      file.mimetype=='video/mp4' ||
      file.mimetype =='application/pdf'||
      file.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||
      file.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||
      file.mimetype=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Invalid format!"));
    }
  },
  limits: { fileSize: maxSize },
}).single('file');

app.post("/upload",(req, res) => {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(500).json({isUploaded:false,url:null})
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(500).json({isUploaded:false,url:null})
      }
     
      else{
        res.status(200).json({isUploaded:true,url:req.file.path})
      }
   
    }) 
  } catch (error) {
    res.status(500).json({isUploaded:false,url:null})
  }
 
});
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});