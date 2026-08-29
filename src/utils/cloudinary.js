import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.Cloudinary_Cloud_Name,
  api_key: env.Cloudinary_Api_Key,
  api_secret: env.Cloudinary_Api_Secret,
});

export const uploadOnCloudinary = async (buffer) => {
  try {
    if (!buffer) {
      console.error("Buffer missing");
      return null;
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "users/profile",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(buffer);
    });

    console.log("✅ Cloudinary upload successful");
    console.log(result.secure_url);

    return result;

  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    return null;
  }
};






/*
{
  "message": "Server returned unexpected status code - 403",
  "http_code": 403,
  "name": "UnexpectedResponse"
}

Age ye error aye to. cloudnary me uplded seacury me jake 
Restricted image types: uploded enable hona chiaye

*/