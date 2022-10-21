const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

mongoose.connect("mongodb+srv://admin-yousuf:nailamarium@cluster0.zc9mh3w.mongodb.net/todolistDB");
// mongoose.connect("mongodb://localhost:27017/todolistDB");

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

    if(foundItems.length === 0){
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

    const checkedItemId =  req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today'){
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("Successfully deleted checked item");
                res.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }


});

app.get('/:name', function(req, res){

    const CLS = _.capitalize(req.params.name);
    
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
app.listen(process.env.PORT, function() {
    console.log("Server has started Sucessfully.");
});