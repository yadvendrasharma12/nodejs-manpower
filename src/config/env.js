import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 50001,
  mongoUrl:process.env.MONGODB_URL,
  Refresh_token: process.env.REFRESH_TOKEN_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  Access_token_expire:process.env.EXPIRE_ACCESS_TOKEN,
  Refresh_token_expire:process.env.EXPIRE_REFRESH_TOKEN,
  Cloudinary_Cloud_Name:process.env.CLOUDINARY_CLOUD_NAME,
  Cloudinary_Api_Key:process.env.CLOUDINARY_API_KEY,
  Cloudinary_Api_Secret:process.env.CLOUDINARY_API_SECRET,

};