import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only images and PDF files are allowed'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Middleware for handling multiple files (client and advocate)
export const uploadFiles = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'barCertificate', maxCount: 1 }
]);

// Middleware for handling single file
export const uploadSingle = upload.single('file');

export default upload;