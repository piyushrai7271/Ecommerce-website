const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");


app.use(express.json());
app.use(cors());

//Database connection

mongoose.connect("mongodb+srv://piyushrai7271:Ecommerce@cluster0.uvrvohj.mongodb.net/e-commerce");

// Api creation

app.get("/",(req,resp)=>{
    resp.send("Express app is running")
});

// Image storage Engien

const storage = multer.diskStorage({
    destination:'./upload/imageg',
    filename:function(req,file,cb){
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage});

// creating upload image
app.use("/images",express.static("upload/image"))

app.post("/upload",upload.single('product'),(req,resp)=>{
   resp.json({
      success:1,
      image_url:`http://localhost:${port}/images/${req.file.filename}`
   })
})

// Schema for creating products

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
      type:Number,
      required:true
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    avilable:{
        type:Boolean,
        default:true
    },
})

//adding product

app.post("/addproduct",async(req,resp)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id=last_product.id + 1;
    }else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    });

    console.log(product);
    await product.save();
    console.log("saved");
    resp.json({
        success:true,
        name:req.body.name,
    })
})

// creating api for deleting products

app.post("/remove_product",async(req,resp)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Removed");
    resp.json({
        success:true,
        name:req.body.name,
    })
})

//creating api for getting all products

app.get("/allproducts",async(req,resp)=>{ //allproducts in place of all_products
    let products = await Product.find({});
    console.log("All products fetched");
    resp.send(products);
})






app.listen(port || 4500,(err)=>{
    if(!err){
        console.log("server running at port :" + port);
    }else{
        console.log("Error : " + err)
    }
})