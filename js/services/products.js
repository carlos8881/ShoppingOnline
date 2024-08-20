const AWS = require('./aws-config');
const s3 = new AWS.S3();

const uploadParams = {
  Bucket: 'carlos-shopping-online',
  Key: 'your-image-file-name.jpg',
  Body: 'your-image-data',
  ACL: 'public-read'
};

s3.upload(uploadParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }
});