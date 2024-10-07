const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: 'ap-northeast-1',
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'carlos-shopping-online',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

module.exports = upload;