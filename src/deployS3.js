// deployS3.js
// deployS3.js
const { addInstanceToTable } = require('./utils');

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

function retrieveInstanceDataFromS3() {
    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName,
        Key: 'instanceData.json'
    };
    //alert ('Showing S3 bucket :', params);
    console.log('Showing S3 bucket :', params);
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error retrieving instance data from S3:', err);
        } else {
            // Parse the retrieved data
            const instanceData = JSON.parse(data.Body.toString());
            console.log('Instance data retrieved from S3:', instanceData);

            // Populate your table with the instance data
            //addInstanceToTable(instanceData);
        }
    });
}

//retrieveInstanceDataFromS3();
//deployS3Bucket();


// Export the function so it can be used in other modules
module.exports = { deployS3Bucket, bucketName, retrieveInstanceDataFromS3 };




