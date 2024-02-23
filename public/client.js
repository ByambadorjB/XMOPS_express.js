
document.addEventListener('click', function(event){
    // check if the clicked event is the Destroy button
    if(event.target.classList.contains('btn-destroy')){
        destroyEC2();
    }
}); 
// Import the retrieveInstanceDataFromS3 function from utils.js
import retrieveInstanceDataFromS3 from './utils.js';

// Trigger the function to retrieve instance data from S3 when the page loads
// window.onload = () => {
//     retrieveInstanceDataFromS3()
//         .then(instanceData => {
//             // Populate the table with the retrieved instance data
//             addInstanceToTable(instanceData);
//         })
//         .catch(error => {
//             console.error('Error retrieving instance data from S3:', error);
//         });
// };
