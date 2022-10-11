const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

var items = [];

app.get("/", function(req, res){

var today = new Date();
var day = "";

var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

var day = today.toLocaleDateString("en-US", options);

res.render("list", {kindOfDay: day, newListItems:items});

});

app.post("/", function(req, res){
    var item = req.body.newItem;

    items.push(item);

    res.redirect("/");


});


var port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});