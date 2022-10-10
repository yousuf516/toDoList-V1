const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.send("Hello");
});

var port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});