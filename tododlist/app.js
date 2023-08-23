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

const listSchema=new mongoose.Schema({
    name:String,
    item:[itemSchema]

});
const List= mongoose.model("List",listSchema)
const defaultItem=[item1,item2,item3];
async function itemInsert(){
 try{await Item.insertMany(defaultItem);
 console.log("Successfully insert");
}catch(err){
    console.log(err);

}}
//itemInsert();




app.get("/",async(req,res)=>{
   
try{
       const items=await Item.find({});
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



app.get("/:customListName",async(req,res)=>{
   try{const customListName= req.params.customListName;
   const foundItem=await List.findOne({name:customListName})
        if(!foundItem){
            const list=new List({
            name:customListName,
            item: defaultItem
           });   await list.save();
           console.log("created");
           res.redirect("/"+customListName);
            
        }
        else {
            console.log("Found Item:", foundItem);
            res.render("list",{listTitle:foundItem.name,list:foundItem.item});
        }
    
   }
   catch(err){
    console.error(err);
   }
   
}
);




app.post("/delete",async(req,res)=>{
    try{const checkitemID=req.body.checkbox;
        const listName=req.body.ClistName;
        console.log(req.body.ClistName);
        if(listName=="today"){
            await Item.findOneAndRemove({_id:checkitemID})
            console.log("successfully removed");
                 res.redirect("/");
        }
        else{//i will find that list and updated it
            const found2=await List.findOneAndUpdate({name:listName},{$pull:{item:{_id:checkitemID}}});
            if(found2){
                res.redirect("/"+listName);
            }
            else{ res.redirect("/");

            }
        }
   
       
    }
    catch(err){
        console.error(err);
    }
})

app.post("/", async (req, res) => {
    const newItem = req.body.NewItem;
    const listTitle = req.body.list;
    const items = new Item({ name: newItem });
    try {
        if (listTitle === "today") {
            await items.save();
            res.redirect("/");

            
        } else {
            const found = await List.findOne({ name: listTitle });
            if (found) {
                found.item.push(items);
                await found.save();
                res.redirect("/" + listTitle);
            } else {
                console.log("List not found:", listTitle);
                res.redirect("/");
            }
        }
        
       
    } catch (err) {
        console.log(err);
    }
});

  

app.listen(port,()=>{
    console.log(`Server is running in ${port}`)
});