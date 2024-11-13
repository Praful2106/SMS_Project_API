const express= require("express")
const mongoose = require("mongoose")
const router= require("./route/routes")
const app= express()
const cors=require("cors")
app.use(express.json())

mongoose.connect("mongodb+srv://PrafulRathod:7447317446@cluster0.jjtad.mongodb.net/").then((data)=>{
    console.log("mongodb connected successfully")
}).catch((err)=>{
    console.log(err)
})
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If handling credentials
}));

// Handle preflight OPTIONS requests
app.options('*', cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use("/api-sms/", router)

app.listen(8000, ()=>{
    console.log("app is running on port 8000")
})