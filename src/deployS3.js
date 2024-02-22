// deployS3.js

const AWS = require('aws-sdk');

// Configure AWS credentials globally
AWS.config.update({
    accessKeyId: 'AKIAXZO6SAUMZBVQHHJL',
    secretAccessKey: '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',
    region: 'ap-southeast-2'
});

const bucketName = 'xmops-data-bucket-team2';

async function deployS3Bucket(){
    
    const s3 = new AWS.S3();

    // Check if the bucket already exists
    s3.headBucket({Bucket: bucketName}, (err, data) => {
        if(err){
            if(err.statusCode === 404) {
                // Bucket does not exist, create it
                s3.createBucket({Bucket: bucketName}, (error, data) => {
                    if(error){
                        console.error('Failed to create bucket: ', error);
                    } else {
                        console.log('Bucket created successfully: ', data.Location);
                    }
                });
            } else {
                console.error('Error checking bucket: ', err);
            }
        } else{
            console.log('Bucket already exists: ', bucketName);
        }
    });
   
};

//deployS3Bucket();


// Export the function so it can be used in other modules
module.exports = { deployS3Bucket, bucketName };




