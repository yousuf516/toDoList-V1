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
    itemName: "Welcome to Your Todolist"
});

const Item2 = new Item ({
    itemName: "Hit the + button to add a new item."
});

const Item3 = new Item ({
    itemName: "<-- Hit this to delete an item." 
});

const defaultItems = [Item1, Item2, Item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

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
    const listName = req.body.list;

    const item = new Item ({
        itemName: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        });
    }


});

app.post("/delete", function(req, res){

    const checkedItemId =  req.body.checkbox

    Item.findByIdAndRemove(checkedItemId, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Successfully deleted checked item");
            res.redirect("/");
        }
    })


});

app.get('/:name', function(req, res){

    const CLS = req.params.name;
    
    List.findOne({name:CLS}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List ({
                    name: CLS,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + CLS)
            }
            else{
                res.render("list", {listTitle: CLS, newListItems:foundList.items});
            }
        }
    })


});



let port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});