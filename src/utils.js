const AWS = require('aws-sdk'); // Import AWS SDK

function parseInstanceData(stdout){
    const lines = stdout.split('\n');
    const instanceData = {};

    lines.forEach(element => {
        const parts = element.split(' = ');
        if(parts.length === 2){
            const key = parts[0].trim();
            const value = parts[1].replace(/"/g, '').trim(); // remove double quotes

            // Map the specific keys to their corresponding values
            if( key === 'ami_id' ||
                key === 'availability_zone' ||
                key === 'instance_id' ||
                key === 'instance_state' ||
                key === 'instance_type' ||
                key === 'key_name' ||
                key === 'private_ip' ||
                key === 'public_ip') {
                instanceData[key] = value;
            } 
        }
    });
    
    return instanceData;
}

// Create S3 service object
const s3 = new AWS.S3();

// // Define the data to write as JSON
// const data = {
//     ami_id: "DDDDDDDDDDDDD",
//     availability_zone: "ap-southeast-2c",
//     instance_id: "i-0594aef5d7ae91766",
//     instance_state: "running",
//     instance_type: "t2.micro",
//     key_name: "wordpress_server",
//     private_ip: "172.31.24.39",
//     public_ip: "3.27.255.65"
// };

// Convert the data to JSON string
//const jsonData = JSON.stringify(data, null, 2);

// Specify S3 bucket name and object key
// const bucketName = 'xmops-data-bucket-team2';
// const key = 'data.json'; // Specify the key for the JSON file in S3

// Function to upload data to S3 bucket
async function uploadToS3(data, bucketName, fileName){
    
    //Define parameters for the object
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: data,
        ContentType: 'application/json' // Optional, set the content type if necessary
    };

    console.log(params);


    // //Upload the Json data to s3
    // s3.putObject(params, (err, data) => {
    //     if(err){
    //         console.error('Error uploading data to S3: ', err);
    //     } else {
    //         console.log('Data uploaded successfully to S3: ', data);
    //     }
    // });

    try{
        //Upload the object to the s3 bucket
        const result = await s3.upload(params).promise();
        console.log('Data uploaded successfully: ', result.Location);
        return result; // Return the upload result
    } catch (error) {
        console.error('Error uploading data: ', error);
        throw error;
    }

}

//uploadToS3(jsonData, bucketName, key);

// Export parseInstanceData and uploadToS3 functions
module.exports = {
    parseInstanceData,
    uploadToS3
};