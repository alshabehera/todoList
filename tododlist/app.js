import express from "express";
import bodyParser from "body-parser";
//import {dirname} from "path";
//import { fileURLToPath } from "url";

import mongoose from 'mongoose';


const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port=3000;

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true });
const itemSchema=new mongoose.Schema({
    name:String,
})
const Item=mongoose.model('Item',itemSchema);

const item1= new Item({
    name:"Welcome to todo list",
});
const item2=new Item({
    name:"hit + button to add an extra todo",
});
const item3=new Item({
    name:"<---hit to delete this item",
})



async function itemInsert(){
 try{await Item.insertMany([item1,item2,item3]);
 console.log("Successfully insert");
}catch(err){
    console.log(err);
}finally{
    mongoose.disconnect();
}
}
//itemInsert();
const items=["buy a new bf","buy a new clg","die"];
const workItems = [];



app.get("/",async(req,res)=>{
   
try{
       const items=await Item.find({});
        console.log(items);
        if(items.length===0){
            itemInsert();res.redirect("/");

        }
        else{
           res.render("list.ejs",{listTitle:"today",list:items});
        }
       
    }catch(err){
        console.log(err);
    }
    

});
app.get("/work", (req,res)=>{
    res.render("list.ejs", {listTitle: "work", list: workItems});
  });
app.post("/", async (req, res) => {
    const newItem = req.body.NewItem;
    const listTitle = req.body.list;

    try {
        if (listTitle === "work") {
            // Handle work items differently
            // ...
        } else {
            const item = new Item({ name: newItem });
            await item.save();
        }
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});
//app.post("/",(req,res)=>{
    //const newItem=req.body.NewItem;
    //if(req.body.list==="work"){
      //  workItems.push(newItem);
      //  res.redirect("/work");
    //}
    //else{items.push(newItem);
   // res.redirect("/");}
   
    //console.log(newItem);
    //const iteme=new Item({
        //name:newItem,
   // });
   // iteme.save();
    //res.redirect("/");

//})

  

app.listen(port,()=>{
    console.log(`Server is running in ${port}`)
});