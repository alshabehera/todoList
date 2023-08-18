import express from "express";
import bodyParser from "body-parser";
//import {dirname} from "path";
//import { fileURLToPath } from "url";
import { getDate, getDay } from './date.js';
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port=3000;
const items=["buy a new bf","buy a new clg","die"];
const workItems = [];

const day = getDate();

app.get("/",(req,res)=>{
    res.render("list.ejs",{listTitle:day,list:items});
});
app.get("/work", (req,res)=>{
    res.render("list.ejs", {listTitle: "work", list: workItems});
  });

app.post("/",(req,res)=>{
    const newItem=req.body.NewItem;
    if(req.body.list==="work"){
        workItems.push(newItem);
        res.redirect("/work");
    }
    else{items.push(newItem);
    res.redirect("/");}

})

  

app.listen(port,()=>{
    console.log(`Server is running in ${port}`)
});