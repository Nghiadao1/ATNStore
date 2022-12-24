const express = require('express');
const engines = require('consolidate');
const app = express();


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://0.0.0.0:27017";
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/',(req,res)=>{
    res.render('home');
})

 app.get('/products',async function(req,res){
     let client= await MongoClient.connect(url);
     let dbo = client.db("ToyStore2");
     let results = await dbo.collection("products").find({}).toArray();
     res.render('allProducts',{model:results});
 })

app.get('/products2',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore2");
    let results = await dbo.collection("products2").find({}).toArray();
    res.render('allProducts2',{model:results});
})
 app.get('/insertProducts',(req,res)=>{
     res.render('insertProducts');
 }) 

 app.post('/doInsertProducts',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputName = req.body.txtName;
     let inputSize = req.body.txtSize;
     let inputPrice = req.body.txtPrice;
     let inputAmount = req.body.txtAmount;
     let inputdescribe = req.body.txtDescribe;
     let inputPic = req.body.txtPic;
     let newProducts = { id_product:inputId, name : inputName , size : inputSize , price :inputPrice,amount : inputAmount, describe: inputdescribe, pic:inputPic};
     if(inputName.trim().length ==0){
        let modelError ={
                //idError:"You must enter id!",
                nameError:"You must enter Name!",
                // sizeError:"You must enter Size",
                // priceError:"You must enter Price",
                // amountError:"You must enter Amount",
                // describeError:"You must enter Describe",
                // picError:"You must enter Picture",
            };
        res.render('insertProducts',{model:modelError});
        }else if(isNaN(inputAmount)){
            let modelError1 =  {amountError:"Enter number" };
            res.render('insertProducts',{model:modelError1});
        }else{
     let client= await MongoClient.connect(url);
     let dbo = client.db("ToyStore2");
     await dbo.collection("products").insertOne(newProducts);
     res.redirect('/products');
    }
 })

app.get('/insertProducts2',(req,res)=>{
    res.render('insertProducts2');
})

app.post('/doInsertProducts2',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputName = req.body.txtName;
     let inputSize = req.body.txtSize;
     let inputPrice = req.body.txtPrice;
     let inputAmount = req.body.txtAmount;
     let inputdescribe= req.body.txtDescribe;
     let inputPic = req.body.txtPic;
     let newProducts = { 
        id_product:inputId,
         name : inputName ,
          size : inputSize , 
          price :Number.parseInt(inputPrice),
          amount : inputAmount, 
          describe:inputdescribe, 
          pic:inputPic
        };
     if(inputName.trim().length ==0){
        let modelError ={
             //   idError:"You must enter id!",
                nameError:"You must enter Name!",
            //     sizeError:"You must enter Size",
            //     priceError:"You must enter Price",
            //     amountError:"You must enter Amount",
            //     describeError:"You must enter Describe",
            //     picError:"You must enter Picture",
             };
        res.render('insertProducts',{model:modelError});
    }else if(isNaN(inputAmount)){
            let modelError1 =  {amountError:"Enter number" };
            res.render('insertProducts',{model:modelError1});
        }else{
     let client= await MongoClient.connect(url);
     let dbo = client.db("ToyStore2");
     await dbo.collection("products2").insertOne(newProducts);
     res.redirect('/products2');
    }
 })


 app.get('/delete',async (req,res)=>{
     let inputId = req.query.id;
     let client= await MongoClient.connect(url);
     let dbo = client.db("ToyStore2");
     var ObjectId = require('mongodb').ObjectId;
     let condition = {"_id" : ObjectId(inputId)};
     await dbo.collection("products").deleteOne(condition);
     res.redirect('/products');

 })

app.get('/delete2',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore2");
    var ObjectId = require('mongodb').ObjectId;
    let condition = {"_id" : ObjectId(inputId)};
    await dbo.collection("products2").deleteOne(condition);
    res.redirect('/products2');     

})

 app.post('/doSearchProducts',async (req,res)=>{
     let inputName = req.body.txtName;
     let client= await MongoClient.connect(url);
     let dbo = client.db("ToyStore2");
     let results = await dbo.collection("products").find({name: new RegExp(inputName,'i')}).toArray();
    
     res.render('allProducts',{model:results});

 })

app.post('/doSearchProducts2',async (req,res)=>{
    let inputName = req.body.txtName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore2");
    let results = await dbo.collection("products2").find({name: new RegExp(inputName,'i')}).toArray();
    
    res.render('allProducts2',{model:results});

})

app.get('/update',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore2");
    var ObjectId = require('mongodb').ObjectId;
    let condition = {"_id" : ObjectId(inputId)};
    let results = await dbo.collection("products").find(condition).toArray();
    res.render('update',{model:results});
})

 app.post('/doupdate',async (req,res)=>{
    let inputId = req.body.id;
    let inputId1 = req.body.txtId;
    let inputName = req.body.txtName;
    let inputSize = req.body.txtSize;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;
    let inputdescribe = req.body.txtDescribe;
    let inputPic = req.body.txtPic;
    let Change = {$set:{id_product:inputId1, name : inputName , size : inputSize , price : inputPrice , amount : inputAmount, describe: inputdescribe, pic: inputPic }};
        let client= await MongoClient.connect(url);
        var ObjectId = require('mongodb').ObjectId;
        let dbo = client.db("ToyStore2"); 
        await dbo.collection("products").updateOne({_id : ObjectId(inputId)},Change);
        res.redirect('/products');

})



app.get('/update2',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore2");
    var ObjectId = require('mongodb').ObjectId;
    let condition = {"_id" : ObjectId(inputId)};
    let results = await dbo.collection("products2").find(condition).toArray();
    res.render('update2',{model:results});
})

app.post('/doupdate2',async (req,res)=>{
    let inputId = req.body.id;
    let inputId1 = req.body.txtId;
    let inputName = req.body.txtName;
    let inputSize = req.body.txtSize;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;
    let inputdescribe = req.body.txtDescribe;
    let inputPic = req.body.txtPic
    let Change = {$set:{id_product:inputId1, name : inputName , size : inputSize , price : inputPrice , amount : inputAmount, describe: inputdescribe, pic: inputPic }};
        let client= await MongoClient.connect(url);
        var ObjectId = require('mongodb').ObjectId;
        let dbo = client.db("ToyStore2"); 
        await dbo.collection("products2").updateOne({_id : ObjectId(inputId)},Change);
        res.redirect('/products2');

})  
/// Login



app.set('view engine','hbs')

const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.get('/login',(req,res)=>{
    let landingPage = req.query.destination
    res.render('login')
})
function isLoggedin(req,res,next){
    if(req.session.userid){
        next()
    }else{
        res.redirect('/login')
    }
}
app.get('/needlogin',isLoggedin,(req,res)=>{
    res.end("Well you have loggedin!")
})
app.get('/nologin',(req,res)=>{
    res.end("This page doesn't require login!")
})


async function login(user,pass){
    let client = await MongoClient.connect(url)
    let db = client.db("ToyStore2")
    let userDB = await db.collection("websiteUser").
            findOne({$and:[{userName:user},{password:pass}]})
     console.log(user)
    return userDB
}
app.use(express.urlencoded({extended:true}))
app.post('/user', async (req,res)=>{
    const user = await login(req.body.username,req.body.password)
    if(user){
        let session=req.session;
        session.userid=user.userName
        session.role = user.role
        console.log(req.session)
        res.redirect('/')
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/',(req,res)=>{
    session=req.session
    res.render('home',{'userid':session.userid,'role':session.role})
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Server is running on: ", PORT)
})