import crypto from 'crypto';


export const generateOtp = ()=>{
  return crypto.randomInt(100000,1000000).toString();
}

export const veryfyOtp = (storeOtp, enterOtp)=>{
 return storeOtp === enterOtp;
}



// send otp api     

/*
{
  "email": "abc@gmail.com",
  "phone": "9876543210",
  "password": "123456"
}

verify 
{
  "phone": "9876543210",
  "otp": "482913"
}
   */