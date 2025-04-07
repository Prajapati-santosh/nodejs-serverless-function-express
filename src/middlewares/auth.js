import jwt from 'jsonwebtoken'

function auth(req,res,next){
    const token=req.cookies.sessionStorage;
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }
    const isIt=jwt.verify(token,process.env.JWT_SECURITY_KEY);
    if(isIt){
        console.log("verified");
    }
    else{
        console.log("Not verified");
    }
    next();
}

export default auth;