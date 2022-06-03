var express = require('express');
var router = express.Router();
var mongoose= require ("mongoose");
var db = mongoose.connect("mongodb://127.0.0.1:27017/maBase");
var bodyp=require("body-parser");
const { type } = require("express/lib/response");
var bp=bodyp.urlencoded({extended:false})


var ProductSchema=mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  inventoryStatus: String,
  image: String,
  rating: Number,
  //listeEnseignant:{type: mongoose.Schema.Types.ObjectId, ref:"EnseignantSchema"}
  });

var CategorySchema=mongoose.Schema({
  nom: String,
  listeProduct:[{type: mongoose.Schema.Types.ObjectId, ref:"ProductSchema"}]
  });

  var Product=mongoose.model("Products", ProductSchema);
  var Category=mongoose.model("Categories", CategorySchema);


// CRUD Product ***********************************************

router.post("/Product",bp, function(req,res){
  var  name = req.body.name
  var  description = req.body.description
  var  price = req.body.price
  var  quantity = req.body.quantity
  var  inventoryStatus = req.body.inventoryStatus
  var  category = req.body.category  
  var image = req.body.image
  var rating = req.body.rating 
  console.log(rating)
  var product1 = new Product({name:name,description:description,price:price,quantity:quantity,inventoryStatus:inventoryStatus,image:image,rating:rating})
  product1.save();
   Category.findOne({ nom: category }, (err,cat)=>{
     cat.listeProduct.push(product1._id)
     cat.save()
     console.log(cat)
   })
  
  res.status(200).send(product1.id)
  //res.redirect("/tutorials");
});

router.get("/Product",function(req,res){
  Product.aggregate([{
    $lookup:{
      from:"categories",
      localField:"_id",
      foreignField: "listeProduct",
      as: "category"
    }
  },
  
  {$project:{
    _id:1,
    name: 1,
    description: 1,
    price: 1,
    quantity: 1,
    inventoryStatus: 1,
    image:1,
    rating:1,
    category:{ nom: 1}
  }} 
 ]).exec(function(err,result){
  // console.log(result)
 res.status(200).send({"data":result})
})
	// Product.find().then(function (product) {
  //   // console.log(product)
  //   res.status(200).send({"data":product});
  // })
});

router.put("/Product/:id",bp,function(req,res){
  var  name = req.body.name
  var  description = req.body.description
  var  price = req.body.price
  var  quantity = req.body.quantity
  var  inventoryStatus = req.body.inventoryStatus
  var image = req.body.image
  var rating = req.body.rating
	Product.findByIdAndUpdate(req.params.id,{name:name,description:description,price:price,quantity:quantity,inventoryStatus:inventoryStatus,image:image,rating:rating},function(err,u){})
  res.status(200).send("updated")
});

router.delete("/Product/:id",function(req,res){
	Product.findByIdAndDelete(req.params.id,function(err,u){})
  res.status(200).send("deleted")
});
router.delete("/Product",function(req,res){
	Product.deleteMany({name : 'test2'},function(err,u){})
  res.status(200).send("deleted")
});


// CRUD Category ***********************************************

router.post("/Category",bp, async function(req,res){
  
  var  category = req.body.category  
  var category1 = new Category({nom:category})
  category1.save();

  
  res.status(200).send(category1.id)
  //res.redirect("/list");
});

router.get("/Category",function(req,res){
	Category.find().then(function (category) {
    // console.log(product)
    res.status(200).json(category);
  })
});

router.delete("/Category/:id",function(req,res){
	Category.findByIdAndDelete(req.params.id,function(err,u){})
  res.status(200).send("deleted")
});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
