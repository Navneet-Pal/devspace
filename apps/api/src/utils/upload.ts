import type { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

import cloudinary from "../config/cloudinary.js";

export const uploadImage = (
  file: Express.Multer.File,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result as UploadApiResponse);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const deleteImage = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};

export const uploadFile = (
  file: Express.Multer.File,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result as UploadApiResponse);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const deleteFile = async (
  publicId: string,
  resourceType: "image" | "raw" | "video",
) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}; 
