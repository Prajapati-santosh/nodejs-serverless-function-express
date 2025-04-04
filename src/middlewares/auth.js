import jwt from 'jsonwebtoken'

function auth(req,res,next){
    const token=req.cookies.sessionStorage;
    console.log(token);
    // const isIt=jwt.verify(token,process.env.JWT_SECURITY_KEY);
    // if(isIt){
    //     console.log("verified");
    // }
    next();
}

export default auth;