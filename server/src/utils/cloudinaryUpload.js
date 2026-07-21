
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const imageUploadUtil = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    uploadStream.on("error", (err) => {
      reject(err);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export default imageUploadUtil;
