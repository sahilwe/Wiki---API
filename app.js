const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app =express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
})

 const Article = new mongoose.model("Article" , articleSchema);


 app.route("/articles")

.get(function(req ,res){
   Article.find( {},function(err , foundArticles){
     res.send(foundArticles);
   });
 })
///////////////////////////////////////posting//////////////////////////////////
 .post( function(req , res){
 const newArticle = new Article({
   title:req.body.title,
   content: req.body.content
 });
 newArticle.save(function(err){
   if(!err){
     res.send("Article is added Successfully");
   }else{
     res.send(err);
   }
 });
})
///////////////////////////////////deletion ///////////////////////////////
 .delete( function(req ,res){
   Article.deleteMany(function(err){
     if(!err){
       res.send("all articles are deleted Successfully");
     }else{
       res.send(err);
     }
   });
 })
//////////////////////////////////////for specific article ///////////////////////////
app.route("/articles/:articleTitle")
.get(function(req , res){
  Article.findOne({title:req.params.articleTitle}, function(err ,foundArticle){
    if(!err){
      console.log(foundArticle);
      res.send(foundArticle);
    }else{
      res.send("The Article You are looking for is not present");
    }
  });
})
///////////////////////////////////////updation ///////////////////////////////////
.put(function(req , res){
  Article.updateOne({title:req.params.articleTitle}, {title:req.body.title, content:req.body.content},
    {overwrite:true},
  function(err){
    if(!err){
      res.send("Successfully updated article");
    }else{
      res.send(err);
    }
  });
})
.patch(function(req,res){
  Article.update({title:req.params.articleTitle},{$set:req.body},
  function(err){
    if(!err){
      res.send("Successfully updated your data");
    }else{
      res.send(err);
    }
  })
})
/////////////////////////////////////////deletetion////////////////////////////////////
.delete(function(req, res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Successfully deleted item");
    }else{
      res.send(err);
    }
  })
})




app.listen(3000, function(req , res){
  console.log("site is Successfully running on port 3000");
})
