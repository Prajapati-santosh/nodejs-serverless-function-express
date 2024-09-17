import express from "express";
import data from "./Data/DataMap.js";
import cors from"cors";

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


// API for otp generation

function generateOTP(){
    let nums="0123456789";
    let otp='';
    for(let i=0;i<4;i++){
        otp+=nums[Math.floor(Math.random()*nums.length)];
    }
    return otp;
}

app.get("/otp",(req,res)=>{
    let otp=generateOTP();
    res.send(`${otp}`);
})



// 
app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
})
