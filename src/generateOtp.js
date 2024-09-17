function generateOTP(){
    let nums="1234567890";
    let otp='';
    for(let i=0;i<4;i++){
        otp+=nums[Math.floor(Math.random()*nums.length)];
    }
    return otp;
}

export default generateOTP;