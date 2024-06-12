const cors = require('cors');
const taskRoute = require('./routes/taskRoute');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { updateTask } = require('./controllers/taskController');

app.use(cors());
app.use(express.json());

const s3 = new S3Client({
  region: "us-east-1", 
  credentials: {
    accessKeyId: dotenv.S3_ACCESS_KEY,
    secretAccessKey: dotenv.S3_SECRET_KEY,
  }
});

const myBucket = 'aws-img-upload';

var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: myBucket,
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      },
      async afterUpload(req, file, cb) {
        const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: myBucket, Key: file.key }), { expiresIn: 3600 });

        req.file.url = url;
        cb(null, {...file, url});
      }
    })
  });
var fileKey;
var email;
console.log(fileKey,email);
app.post("/upload", upload.single("myPic"), async(req,res) => {
  const mail = req.body;
  email=mail;
  //console.log(req.file.key);
  fileKey=req.file.key;
  await updateDb(res);
  res.send("Successfully upload");
});

function updateDb(res) {
  const image = "https://aws-img-upload.s3.amazonaws.com/"+fileKey;
  console.log(image);
  const emailString =email.email;
  const query = `UPDATE Users SET image = ? WHERE email = ?`;
  db.query(query, [image,emailString], (err, results) => {
    if (err) {
      console.log("error in upload",err);
    } else {
      console.log("upload success");
    }
  });
}


app.use('/api', taskRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
