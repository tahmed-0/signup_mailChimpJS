const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//get static files to get the files 
app.use(express.static("public"))

app.get('/', (req, res) => {
   res.sendFile(__dirname+ "/signup.html");
})

app.post("/", function (req, res) {

    //delcare variables
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;


    //data
    const data = {
        members: [

            { 
                email_address: email,
                status: "subscribed",
                merge_fields: {

                    FNAME: firstName,
                    LNAME: lastName
                }
            }



        ]
    };


    //turn data into JSON
    //send this to mailChimp
    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/7fdd869f6d"

    const options = {
        method: "POST",
        auth: "tufael1:9663dfd226c3945fbfc436b8b5fb3492-us10"
    }
  
    const request = https.request(url, options, function(response) {

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })

        if(response.statusCode === 200) {
            res.sendFile(__dirname+ "/success.html");
        } else {
            res.sendFile(__dirname+ "/failure.html");
        }
    })

    //request.write(jsonData);
    request.end();

});


app.post('/failure.html', function(req, res) {
    //redirects to home page when users gets invalid response
    res.redirect("/");
})




//API: 9663dfd226c3945fbfc436b8b5fb3492-us10

//List ID: 7fdd869f6d.


app.listen(3000, function(req, res) {
    console.log("Running on port 3000")
})