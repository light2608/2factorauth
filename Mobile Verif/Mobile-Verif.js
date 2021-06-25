const port = 8080; 
const hostname = 'localhost';


// Load Dependencies
var express = require('express');
// Load configuration from .env file
require('dotenv').config();

// Load and initialize MesageBird SDK
var messagebird = require('messagebird')('TQWMwfiH3bHO1wRhDCrarjF8d');

// Set up and configure the Express framework
const app = express();
app.use(bodyParser.urlencoded({ extended : true }));


// Handle phone number submission
app.post('/api/phone/msgGen', function(req, res) {
    var number = req.body.number;
    
    // Make request to Verify API
    messagebird.verify.create(number, {
        // originator : 'Code',
        // template : 'Your verification code is %token.'
    }, function (err, response) {
        if (err) {
            // Request has failed
            console.log(err);
            res.json({status:400, error: true,msg: err.errors[0].description});
        } else {
            // Request was successful
            console.log(response);
            res.render({status:200, error: false, msgSent: true});
        }
    })    
});

// Verify whether the token is correct
app.post('/api/phone/verifyCode', function(req, res) {
    var id = req.body.id;
    var token = req.body.token;

    // Make request to Verify API
    messagebird.verify.verify(id, token, function(err, response) {
        if (err) {
            // Verification has failed
            console.log(err);
            res.render({status:400, error:true, msg: err.errors[0].description,});
        } else {
            // Verification was successful
            console.log(response);
            res.render({status:200, error: false, codeVerified: true});
        }
    })    
});

// Start the application
app.listen(port, hostname, ()=> {
    console.log(`Listneing to port at http://${hostname}:${port}/api/phone`);
});