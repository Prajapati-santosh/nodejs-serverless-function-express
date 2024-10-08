import express from "express";
import data from "./Data/DataMap.js";
import cors from"cors";
import sendEmail from "./src/SendMail.js";

const app=express();

let corsOption={
    origin:"*"
}

app.use(cors(corsOption));

app.get("/",(req,res)=>{
    res.send("hello");
})

app.get("/data/:key",(req,res)=>{
    if(req.params.key==process.env.API_KEY){
        const query = req.query.name;
        if (!query) {
            return res.json([]);
        }
        const results = data.filter(item =>
            item.productName.toLowerCase().includes(query.toLowerCase())
        );
        res.json(results);
    }
   else{
    res.send("Not authenticated");
   }
})


// API for otp generation for email 

app.get("/otp/:email",(req,res)=>{
   const respon= sendEmail(req.params.email);
   res.send(respon);
})

// 
app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
})
