//jshint esversion:6
<<<<<<< HEAD
const csstree = require('css-tree');
=======

>>>>>>> 34eeed9454ffbd9f803e2b96aa6f84430d5b19cd
const https=require("https");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const { string } = require("css-tree");
const date = require(__dirname + "/date.js");
const _=require("lodash");
require('dotenv').config();


const PORT=process.env.PORT || 3000;
mongoose.set('strictQuery',false);
const connectDB =async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log (`mongoDB Connected : ${conn.connection.host}`);
  }catch(error){
    console.log(error);
    process.exit(1);
  }
}





const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const list_Items_schema={
 name:String 
}

const Value= mongoose.model("value",list_Items_schema);

const Value_1=new Value({
  name: "Buy Food"
});


const Value_2=new Value({
  name: "Cook Food"
});


const Value_3=new Value({
  name: "Eat Food"
});


const items = [Value_1,Value_2,Value_3];

const custom_Items_schema=new mongoose.Schema({
  name:String,
  to_do:[list_Items_schema]
  
})

const Custom=mongoose.model("custom",custom_Items_schema);

const day = date.getDate();



app.get("/", function(req, res) {



Value.find()
.then(function(data){
  if(data.length===0){

  Value.insertMany(items)
  .then(function(){
    console.log("success");
  })
  .catch(function(err){
    console.log(err);
  })
  
  res.redirect("/");
}
else{
    res.render("list", {listTitle: day, newListItems: data});
  }
})
});


app.post("/", function(req, res){

  const item = req.body.newItem;
  const it=req.body.list;
console.log(item);


  const Item=new Value({
    name: item
   });

if(it===day){
 
  Item.save().then(()=>console.log("good"));
  res.redirect("/");
}else{
  
Custom.findOne({name:it})
.then(function(foundList){
  console.log(foundList);
  foundList.to_do.push(Item);
  
  foundList.save().then(()=>console.log("good"));
  res.redirect("/"+it);
})

}

 
 
 
});


app.post("/delete",function(req,res){
  
  const rem=req.body.check;
const rem2=req.body.li_name;
console.log(rem);
console.log(rem2);

if(rem2===day){
  Value.findByIdAndRemove(rem)
  .then(() =>{
    console.log('has been deleted')
    res.redirect('/')
})
.catch(err=>{console.log(err)})

}
else{
  Custom.findOneAndUpdate({name:rem2} ,{$pull:{to_do :{_id:rem  }}})
  .then(()=>{
   
      res.redirect("/"+rem2);
   
      
   
  })

}

})

app.get("/:tab", function(req,res){
  
  const reqtit=_.capitalize(req.params.tab);
  console.log(reqtit);
Custom.findOne({name:reqtit})
.then(function(result)
{
    if(!result){
      
const cu_item=new Custom({
  name:reqtit,
  to_do:items

});
cu_item.save().then(()=>console.log("good"));
res.redirect("/"+reqtit);
    }    
    else{
      res.render("list", {listTitle: result.name, newListItems: result.to_do});
    }

})




});




app.get("/about", function(req, res){
  res.render("about");
});

connectDB().then(()=>{
  app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT} `);
  })
});

 

