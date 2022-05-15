const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
require('dotenv').config()
const _ = require('lodash');
const {
    default: mongoose
} = require("mongoose");
const res = require("express/lib/response");


const homeText = "This is the homepage. What is your blog about? Or do you have a product you want to talk about? Or maybe just one eye-catching title? I'll turn your unique ideas into code."


const aboutText = "This it the about page. A nice short text about the team, more informations about a product gives the viewer a better look about this page."

const contactText = "Whatever your comments are, we want to hear from you. Just fill out the feedback form below and we’ll respond as soon as possible. Giving the best support to you is our priority. We know you're a real person with real questions. Just let us know what you need."




app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


// let posts = [];


mongoose.connect(`mongodb+srv://jasminAdmin:${process.env.PW}@cluster0.nkplb.mongodb.net/blogDB`);

const itemsSchema = {
    title: String,
    content: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    title: "This is the first chapter",
    content: "In this chapter you see simply an example of how the blog posts would look like. With /compose you can add as much as possible some posts. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato. Fu reso popolare, negli anni ’60, con la diffusione dei fogli di caratteri trasferibili “Letraset”, che contenevano passaggi del Lorem Ipsum, e più recentemente da software di impaginazione come Aldus PageMaker, che includeva versioni del Lorem Ipsum."
});

const defaultItem = [item1];



const year = new Date().getFullYear();


app.get("/", function (req, res) {
Item.find({}, function(err, foundItems){

    function deleteItems ( ) {  
        Item.findOneAndDelete(Item, function (err){
     if(!err){
         console.log("Removed items");
     }
        });
        }
        setTimeout(deleteItems, 300000);
    
    if(foundItems.length === 0 ){
        Item.insertMany(defaultItem, function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Successfully saved.");
            }
        });
        res.redirect("/");
    }  else {
        res.render("home", {
            currentYear: year,
            startingContent: homeText,
            newCompose: foundItems
        });
    }
});
 
});



app.get("/about", function (req, res) {
    res.render("about", {
        currentYear: year,
        aboutContent: aboutText
    });
});



app.get("/contact", function (req, res) {

    res.render("contact", {
        currentYear: year,
        contactContent: contactText
    });
});

app.get("/compose", function (req, res) {
    res.render("compose", {
        currentYear: year
    });

});

app.post("/compose", function (req, res) {

    let reqTitle = req.body.title;
    let reqContent = req.body.compose;

const item = new Item ({
    title: reqTitle ,
    content: reqContent
});
item.save();
res.redirect("/");
});


app.get("/chapter/:test", function (req, res) {
    const requiredPost = _.kebabCase([_.lowerCase(req.params.test)]);

    Item.find({}, function(err, foundItems){
        foundItems.forEach(function (post) {
            const arrayOfPost = _.kebabCase([_.lowerCase(post.title)]);
            if (requiredPost === arrayOfPost) {
                res.render("post", {
    
                    currentYear: year,
                    title: post.title,
                    content: post.content
    
                });
            } 
        });
        
    });
      
});



app.listen(process.env.PORT || 3000, function () {
    console.log("Server on port 3000");
});