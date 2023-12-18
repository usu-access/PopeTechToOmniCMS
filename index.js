require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

const app = express();
const port = process.env.PORT || 3005;

function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });
    req.on('end', function(){
      next();
    });
}

app.use(rawBody);

// app.use(bodyParser.json()); //Handles JSON requests
// app.use(bodyParser.urlencoded({extended:true}));

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

require('./src/routes/action-post')(app, cors, corsOptionsDelegate);

var allowlist = ['https://usu-temp.oudemo.com'];

// app.use(cors({
//     origin: "https://usu-temp.oudemo.com",
//     credentials: true,
//     withCredentials:true
//   }))

app.listen(port, () => {
    console.log("server running on port 3005");
});

