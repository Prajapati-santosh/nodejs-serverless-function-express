import express from "express";
import data from "./Data/DataMap.js";
import cors from"cors";
import sendEmail from "./src/SendMail.js";
import Pool from 'pg-pool';
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

const app=express();

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

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

async function postData(userName,passkey) {
    const pool=new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
    })
    const client = await pool.connect();
    try {
        const query=`insert into auth value(nextVal(userSeqId),$1,$2)`;
        const {rows}= await client.query(query,[`${userName}`,`${passkey}`]);
        if (rows.length > 0) {
            return true; 
        } else {
            return null; 
        }
    } catch (error) {
       console.log(error);
    }
}

app.post("/signup/:username/:password",async(req,res)=>{
    try{
        const userName=req.params.username;
        const password= await bcrypt.hash(parseInt(req.params.password,process.env.SALT_ROUND))
        
        const postD=postData(userName,password);
        if(postD){
            res.send("signed up ");
        }else{
            res.send('Not able to sign you up');
        }
    }
    catch(e){
        console.log(e);
    }
})

async function getData(userName) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    const client = await pool.connect();
    try {
        const query = 'select * from auth where userName=$1';
        const values = [`${userName}`];
        const { rows } = await client.query(query, values);
        if (rows.length > 0) {
            return rows[0].passkey; 
        } else {
            return null; 
        }
    } finally {
        client.release();
    }
}

app.get("/getInfo",async(req,res)=>{
    const data= await getData('Santosh');
    res.send(data);
})



app.post("/Login",async(req,res)=>{
    try{
        const [userName,passkey]=req.body;
        if(!userName){
            return res.status(400).send("Enter a valid username");
        }
        const data=await getData(userName);
        if(!data){
            return res.status(400).send("No user Found")
        }
        
        if(bcrypt.compare(passkey,data)){
            console.log(data);
            console.log(password);
            res.send("Wrong password");
        }
        else{
            res.send("user password matched");
        }
    }
    catch(error){
        console.log(error);
    }
})

app.get("/isItMyPassKey", async (req, res) => {
    try {
        const input = req.query.input;
        if (!input) {
            return res.status(400).send("Input is required");
        }

        const encryptt = await bcrypt.hash(input, 10);
        const hashh = "$2a$10$Gx1trgAmXtzTGNNnwM9b2.R6XqRvw6jzT5Wy//eSn1OkZHQm/ZW1S";
        
        const isMatched = await bcrypt.compare(input, hashh);
        if (isMatched) {
            res.send("Matched");
        } else {
            res.send("Not matched");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
})



