import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// configure cloudinary as per your cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file uploaded successfully
        fs.unlinkSync(localFilePath);
        // console.log( "File uploaded successfully on cloudinary : ",response.url );
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // delete locally saved temp file from local storage
        return null;
    }
};

const destroyFromCloudinary = async (filePath) => {
    try {
        if (!filePath) return false;
        await cloudinary.uploader.destroy(filePath);
        return true;
    } catch (error) {
        console.log("Error in destroyFromCloudinary : ", error);
        return false;
    }
};

export { uploadOnCloudinary, destroyFromCloudinary };
