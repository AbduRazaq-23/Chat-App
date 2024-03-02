import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (filePath) => {
  try {
    if (!filePath) {
      return null; // if not file path, return null
    }
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image", // type of image define
    });
    //file has been uploaded succesfully
    console.log(`file has been succesfully uploaded ${result.url}`);
    // fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    fs.unlinkSync(filePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { cloudinaryUpload };
