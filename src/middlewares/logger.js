// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import path from 'path';


// const __logFilePath=`${process.cwd()}/Data/Logs/logs.txt`;


// function logger(req,res,next){
//     const date=Date().slice(8,33);
//     const host=req.hostname;
//     const userAgent = req.headers['user-agent'];
//     const content=req.method+" "+date+" "+host+" "+userAgent ;
    
//     fs.appendFile(__logFilePath, `${content}\n`, (err) => {
//         if (err) {
//             console.error("Error writing to file:", err);
//         } else {
//             console.log("Log written successfully");
//         }
//     });
//     next(); 
// }

// export default logger;