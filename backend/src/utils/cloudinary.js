import fs from "fs";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dyozwocsm",
  api_key: "954392889722493",
  api_secret: "N1Ye9hk__QxErgrohmkSn-avmvs",
});

const cloudinaryUpload = async (filePath) => {
  try {
    if (!filePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    console.log("i am not working");
    fs.unlinkSync(filePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { cloudinaryUpload };
