import { ImageKit } from 'imagekit';
import mongoose from 'mongoose';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadFile = (file, folder = 'NyaySahay') => {
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file.buffer,
            fileName: (new mongoose.Types.ObjectId()).toString(),
            folder: folder
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

export const uploadMultipleFiles = async (files, folder = 'NyaySahay') => {
    try {
        const uploadPromises = files.map(file => uploadFile(file, folder));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        throw error;
    }
};

export default uploadFile;