import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var posts = [];

app.get("/", (req, res) => {
    res.render("index.ejs", {
        tasks : posts,
    });
})

app.get("/new", (req, res) => {
    res.render("new.ejs");
})

app.post("/remove", (req, res) => {
    var idx = req.body['taskNumber'];
    // console.log(idx);
    if(idx - 1 >= 0 && idx - 1  < posts.length){
        posts.splice(idx - 1, 1);
    }
    res.redirect("/");
})

app.post("/new", (req,res) => {
    const post = {
        title : req.body["title"],
        desc : req.body["desc"],
    }
    posts.push(post);
    // console.log(posts);
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})