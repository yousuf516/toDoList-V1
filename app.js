const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

let items = [];
let workItems = [];

app.get("/", function(req, res){

let day = date();

res.render("list", {listTitle: day, newListItems:items});

});

app.post("/", function(req, res){
    let item = req.body.newItem;

    if(req.body.list === "Work List"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }

});

// Work page

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems:workItems});
});


let port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});