const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    itemName: {
        type: String,
        required: true
      }
}

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item ({
    itemName: "Hello 1"
});

const Item2 = new Item ({
    itemName: "Hello 2"
});

const Item3 = new Item ({
    itemName: "Hello 3" 
});

const defaultItems = [Item1, Item2, Item3];


app.get("/", function(req, res){
Item.find({}, function (err, foundItems) {

    if(foundItems.lenght === 0){
        Item.insertMany(defaultItems, function(err){
            if(err) {
                console.log(err);
            }
            else {
                console.log("Added items to the array");
            }
            res.redirect("/");
        });
    }
    else {
        res.render("list", {listTitle: "Today", newListItems:foundItems});
    }
});
});

app.post("/", function(req, res){

    const itemName = req.body.newItem;

    const item = new Item ({
        itemName: itemName
    });

    item.save();

    res.redirect("/");

});

// Work page

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems:workItems});
});


let port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});