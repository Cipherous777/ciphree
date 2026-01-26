// requiring modules
require('dotenv').config();

const express = require("express");
const app = express()
const PORT = process.env.PORT || 8888
const admin = require("firebase-admin")
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const { credential } = require("firebase-admin");

// middleware
app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))


//firestore commands

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()
const auth = admin.auth()
// get and post commands
app.get("/" , (req,res)=>{
res.render("landing.ejs")
})
app.get("/earlyAccess" , (req,res)=>{
    res.render("earlyAccess.ejs")
})
 app.post("/earlyAccess", (req,res)=>{
    try{
     const {name,email} = req.body
     
     const storeData = db.collection("earlyAccess").add({
        name:name,
        email:email,
        date: new Date()
     })
      res.redirect("/")
    }catch(err){
     console.log(err)
     res.redirect("/earlyAccess")
    }
 })


 


// listening to the port
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})