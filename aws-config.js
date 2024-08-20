require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

function uploadToS3(filePath, bucketName, key) {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: bucketName,
        Key: key, 
        Body: fileContent,
        ContentType: 'image/jpeg' 
    };

    return s3.upload(params).promise();
}

// Example usage
uploadToS3('path/to/cover.jpg', 'my-ecommerce-images', 'cover.jpg')
    .then(data => console.log(`File uploaded successfully. ${data.Location}`))
    .catch(err => console.error(err));