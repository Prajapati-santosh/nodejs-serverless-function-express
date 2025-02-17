import fs from 'fs';


function logger(req,res,next){
    const date=Date().slice(8,33);
    const host=req.hostname;
    const userAgent = req.headers['user-agent'];
    const content=req.method+" "+date+" "+host+" "+userAgent ;
    fs.appendFile("/workspaces/nodejs-serverless-function-express/Data/Logs/logs.txt", `${content}\n`, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            console.log("Log written successfully");
        }
    });
    console.log(req.accept);
    
    next(); 
}

export default logger;