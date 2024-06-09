const cloudinary = require('cloudinary').v2;
const fs=require("fs");

exports.uploadImageToCloudinary = async(localFilePath)=>{
    try {
        if (!localFilePath) { return null }
         //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("file has been uploaded successfully ",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("Error during uploading file : ",error.message)
    }
}