import express from "express";
import data from "./Data/DataMap.js";
import cors from"cors";
import sendEmail from "./src/SendMail.js";
import Pool from 'pg-pool';
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'
import auth from "./src/middlewares/auth.js";
import postData from "./src/postData.js"
// import logger from './src/middlewares/logger.js';


const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// async function postData(userName,passkey) {
//     const pool=new Pool({
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//           rejectUnauthorized: false,
//         },
//     })
//     const client = await pool.connect();
//     try {
//         const query=`insert into auth values(nextval('userIdSeq'),$1,$2,'2002-02-27','sp359422@gmail.com')`;
//         const {rows}= await client.query(query,[`${userName}`,`${passkey}`]);
//         if (rows.length > 0) {
//             return true; 
//         } else {
//             return null; 
//         }
//     } catch (error) {
//        console.log(error);
//     }
// }

app.post("/signup",async(req,res)=>{
    try{
        const {userName,passkey}=req.body;
        const password= await bcrypt.hash(passkey,parseInt(process.env.SALT_ROUND));
        const obj={"userName":userName,"passkey":password};
        const postD=postData('signup',obj);
        if(postD){
            res.send(`${userName}`);
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
        const query = 'SELECT passkey FROM auth WHERE userName=$1';
        const values = [userName];
        const { rows } = await client.query(query, values);
        if (rows.length > 0) {
            return rows[0].passkey; // Return the passkey directly
        } else {
            return null;
        }
    } finally {
        client.release();
    }
}

app.get("/getInfo",auth,async(req,res)=>{
    res.send("verified");
})


 
app.post("/Login", async (req, res) => {
    try {
        const { userName, passkey } = req.body;
        if (!userName) {
            return res.status(400).send("Enter a valid username");
        }
        const data = await getData(userName);
        if (!data) {
            return res.status(400).send("No user found");
        }
        const isMatch = await bcrypt.compare(passkey, data);
        if (!isMatch) {
            return res.status(400).send("Wrong password");
        } else {
            const payload = {
                time: Date(),
                username: userName
            };
            //key from enviroment variable
            const key = process.env.JWT_SECURITY_KEY;
            console.log(key);
            const token = jwt.sign(payload, key);
            const cookieOptions = {
                maxAge: 900000, // 1 day
                httpOnly: true,
                secure:true // Ensure cookies are secure in production
            };
            res.cookie('sessionStorage', token, cookieOptions);
            console.log("Cookie set:", token); // Verify the cookie setting
            res.send("User password matched");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});


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

app.post("/newsLetter",async(req,res)=>{
    const data=req.body;
    try{
        const post= await postData('newsletter',data);
        if(post){
            res.status(200).json({ success: true, message: "Newsletter subscription successful!." });
        }else{
            res.status(500).json({ success: true, message: "Internal server error." });
        }
    }
    catch(error){
        console.error("Error in /newsLetter route:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
    
})


app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
})



