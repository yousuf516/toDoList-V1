const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", function(req, res){

let today = new Date();
let day = "";

let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

day = today.toLocaleDateString("en-US", options);

res.render("list", {kindOfDay: day, newListItems:items});

});

app.post("/", function(req, res){
    let item = req.body.newItem;

    items.push(item);

    res.redirect("/");

});

let port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});