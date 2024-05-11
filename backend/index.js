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

// schema creatin for user model

const Users = mongoose.model("Users",{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// creating end point for regestring the user

app.post("/signup",async(req,resp)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return resp.status(400).json({success:false,errors:"existing user found with same email address"});
    }

    let cart = {};
    for (let i= 0; i < 300; i++) {
        cart[1]=0;
        
    }
   
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,"secret_ecom");
    resp.json({success:true,token});

})

//creating endpoint for user login

app.post("/login",async(req,resp)=>{

    let user = await Users.findOne({email:req.body.email})

    if(user){
        const passCompare = req.body.password === user.password;
    if(passCompare){
        const data = {
           user:{
            id:user.id
           }
        }
        const token = jwt.sign(data,"secret_ecom");
        resp.json({success:true,token});
    }
    else{
        resp.json({success:false,errors:"wrong password"});
    }
  }else{
    resp.json({success:false,errors:"wrong email id"});
  }
})

//creating endpoint for new collection data

app.get("/newcollections",async(req,resp)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8) ;
    console.log("NewCollection fetched");
    resp.send(newcollection)
})

//creating endpoiunt for populare in women category

app.get("/popularinwomen",async(req,resp)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("popolar in women is fetched");
    resp.send(popular_in_women);
});

//creating middleware to fetch user

const fetchUser = async (req,resp,next) =>{
    const token = req.header("auth-token");
    if(!token){
        resp.status(401).send({errors:"pleas authenticate using valid token "})
    }
    else{
        try {
            const data = jwt.verify(token,"secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            resp.status(401).send({errors:"pleas authenticate using a valid token"})
        }
    }
}

// creating endpoint for adding products in cart data

app.post("/addtocart",fetchUser,async(req,resp)=>{
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1 ;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    
    resp.send("Added");

})//if error come so here we can can try _id in place of id

app.listen(port || 4500,(err)=>{
    if(!err){
        console.log("server running at port :" + port);
    }else{
        console.log("Error : " + err)
    }
})