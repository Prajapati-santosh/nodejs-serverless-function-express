import express from "express";
import data from "./Data/DataMap.js";
const app=express();


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

app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
    
})
