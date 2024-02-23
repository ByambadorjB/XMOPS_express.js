const AWS = require('aws-sdk'); // Import AWS SDK
const { response } = require('express');
  
function destroyEC2(){
    document.getElementById('statusMessage').innerText = 'Destroying Wordpress installed EC2 instance...'; // Displaying status message
    fetch('/destroy-ec2', {method: 'POST'})
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok From destroyEC2 function in utils.js');
        }
        return response.text();
    })
    .then (data => {
        // Handle successful
        alert('Alerting from destroyEC2 function in utils.js: ', data);
        document.getElementById('statusMessage').innerText = ''; // Clearing status message after completion
    })
    .catch(error => {
        console.error('There was a problem with fetching /destroy-ec2 call from destroyEC2 function in utils.js', error);
        alert('Failed to destroy EC2 instance from destroyEC2 function in utils.js')
        // document.getElementById('statusMessage').innerText = ''; // Clearing status message on error
    });
    // document.getElementById('statusMessage').innerText = ''; // Clearing status message on error
}

function parseInstanceData(stdout){
    const lines = stdout.split('\n');
    const instanceData = {};

    lines.forEach(element => {
        const parts = element.split(' = ');
        if(parts.length === 2){
            const key = parts[0].trim();
            const value = parts[1].replace(/"/g, '').trim(); // remove double quotes

            // Remove ANSI escape codes for color formatting
            //value = value.replace(/\u001b\[0\d+m/g, '');

            //Map the specific keys to their corresponding values
            if( key === 'ami_id' ||
                key === 'availability_zone' ||
                key === 'instance_id' ||
                key === 'instance_state' ||
                key === 'instance_type' ||
                key === 'instance_region' ||
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

// function to add a new row to the running instances table
function addInstanceToTable(instanceDetails){
    //alert('addInstanceToTable function');
    console.log('addInstanceToTable function', instanceDetails);
    const tableBody = document.getElementById('runningInstancesList');
    const newRow = document.createElement('tr');
    alert('Please see the value of instanceDetails value in utils.js: ', instanceDetails);
    console.log('Please see the value of instanceDetails value in utils.js: ', instanceDetails);

    // Populate table cells with instance details
    newRow.innerHTML = `
        <td>${instanceDetails.ami_id}</td>
        <td>${instanceDetails.availability_zone}</td>
        <td>${instanceDetails.instance_id}</td>
        <td>${instanceDetails.instance_region}</td>
        <td>${instanceDetails.instance_state}</td>
        <td>${instanceDetails.instance_type}</td>
        <td>${instanceDetails.key_name}</td>
        <td>${instanceDetails.private_ip}</td>
        <td>${instanceDetails.public_ip}</td>
        <td><button class="btn btn-sm btn-danger btn-destroy">Destroy</button></td>
        `;
        
    // Append the new row to the table body
    tableBody.appendChild(newRow);
}

// Export parseInstanceData and uploadToS3 functions
module.exports = {
    parseInstanceData,
    uploadToS3,
    addInstanceToTable,
    destroyEC2
};