const express = require('express');
const { exec } = require('child_process');
const { error } = require('console');
const { stdout, stderr } = require('process');
const app = express();
const path = require('path'); // Import the 'path' module
// const deployS3Bucket = require('./deployS3');
// const bucketName = require('./deployS3');
const { parseInstanceData, uploadToS3, addInstanceToTable} = require('./utils');
const { deployS3Bucket, bucketName, retrieveInstanceDataFromS3 } = require('./deployS3');


const fs = require('fs');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));
// Serve static files from the 'public' directory
app.use(express.static('src', {
    // Set the correct MIME type for JavaScript files
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));
//app.use(express.static(path.join(__dirname, './src')));
// Serve the CSS file
app.use('/style', express.static(path.join(__dirname, '../style')));

// Initialize Terraform Configuration
// Automatically initialize Terraform Configuration upon server startup
console.log('Initializing Terraform configuration...');
exec('./init-terraform.sh', {cwd: 'src'}, (error, stdout, stderr) => {
    if(error){
        console.error(`Terraform initialization failed: ${error}`);
        return;
        // Handle error during Terraform initialization
    } else {
        console.log('Terraform initialization completed successfully.');
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.log(`Server is running on port ${port} ....`);
        // Terraform configuration initialized successfully
    }
});

// Call the function to deploy the S3 bucket
deployS3Bucket();


// Handle POST request to create EC2 instance
app.post('/create-ec2', (req, res) => {
    exec('terraform apply -auto-approve', { cwd: './src/terraform' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(`stdout: ${stdout}`);

        const instanceData = parseInstanceData(stdout);
        console.log('parsed stdout data' + instanceData);
        // send instance data as a response
        res.status(200).json(instanceData);
        // Convert the object to a JSON string
        const jsonData = JSON.stringify(instanceData, null, 2);

        console.log('Converted parsed stdout data' + jsonData);

        // Write stdout to a JSON file
        fs.writeFile('stdout.json', jsonData, (err) => {
            if(err){
                console.error('Error writing to file: ', err)
            } else {
                console.log('stdout saved to stdout.json');
                //console.log(instanceData);
            }
        });

        // Upload data to s3 bucket
        uploadToS3(jsonData, bucketName, 'instanceData.json')
        .then((result) => {
            console.log('S3 upload result:', result);
            console.log('EC2 creation Data uploaded to S3 ', result.Location);
            //res.send('EC2 instance created successfully!', jsonData);
            // console.log('EC2 instance created successfully! with this data has been transferred to index.html', jsonData);
            // res.status(200).send(jsonData);
            // addInstanceToTable(jsonData);

        })
        .catch((error) => {
            console.error('Error uploading to s3', error);
        });
        console.error(`stderr: ${stderr}`);
        //res.send('EC2 instance created successfully!', jsonData);
        console.log('EC2 instance created successfully! with this data has been transferred to index.html', jsonData);
        //res.status(200).send(jsonData);
        //addInstanceToTable(jsonData);

        // Send jsonData as a response after completion of operations
        //res.send(jsonData);
    });
});

// Handle Post request to destroy EC2 instance
app.post('/destroy-ec2', (req, res) => {
    exec('terraform destroy -auto-approve', {cwd: './src/terraform'}, (error, stdout, stderr) => {
        if (error){
            console.error(`exec error: ${error}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}` + ' Ec2 instance is destroyed successfully');
        res.send('EC2 instance successfully destroyed!');
    });
});

// Handle Post request to provision Wordpress in Lightsail
app.post('/provision-lightsail-wordpress', (req, res) => {
    exec('terraform apply -auto-approve', { cwd: './src/terraform-lightsail' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send('Internal Server Error in Wordpress Lightsail');
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Wordpress in Lightsail is provisioned successfully!');
    });
});

// Handle Post request to destroy Wordpress in Lightsail
app.post('/destroy-lightsail-wordpress', (req, res) => {
    exec('terraform destroy -auto-approve', {cwd: './src/terraform-lightsail'}, (error, stdout, stderr) => {
        if (error){
            console.error('exec error: ${error}');
            res.status(500).send('Internal Server Error in Wordpress Lightsail to destroy');
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}` + 'Wordpress in Lightsail is destroyed successfully!');
        res.send('Wordpress in Lightsail is destroyed successfully!');
    });
});

// Serve static files
//app.use(express.static('public'));

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
