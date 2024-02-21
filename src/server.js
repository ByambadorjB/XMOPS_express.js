const express = require('express');
const { exec } = require('child_process');
const { error } = require('console');
const { stdout, stderr } = require('process');
const app = express();
const path = require('path'); // Import the 'path' module

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));
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
        // Terraform configuration initialized successfully
    }
});


// Handle POST request to create EC2 instance
app.post('/create-ec2', (req, res) => {
    exec('terraform apply -auto-approve', { cwd: './src/terraform' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('EC2 instance created successfully!');
    });
});

// Handle Post request to destroy EC2 instance
app.post('/destroy-ec2', (req, res) => {
    exec('terraform destroy -auto-approve', {cwd: './src/terraform'}, (error, stdout, stderr) => {
        if (error){
            console.error('exec error: ${error}');
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
