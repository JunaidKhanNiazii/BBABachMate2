const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist (using /tmp for serverless/Vercel)
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../uploads');

// Lazy directory creation to avoid startup crash
const ensureUploadDir = () => {
    if (!fs.existsSync(uploadDir)) {
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
        } catch (err) {
            console.error('Failed to create upload directory:', err.message);
        }
    }
};
ensureUploadDir();


// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${timestamp}_${name}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

// Upload file to local storage
const uploadToLocal = async (file) => {
    if (!file) return null;

    try {
        // File is already saved by multer, just return the URL
        const fileUrl = `/uploads/${file.filename}`;
        console.log('File uploaded successfully:', fileUrl);
        return fileUrl;
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};

// Delete file from local storage
const deleteFromLocal = async (fileUrl) => {
    if (!fileUrl) return;

    try {
        // Extract filename from URL
        if (!fileUrl.startsWith('/uploads/')) return;

        const filename = path.basename(fileUrl);
        const filePath = path.join(uploadDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('File deleted:', filename);
        }
    } catch (error) {
        console.error('File delete error:', error);
        // Don't throw - file might already be deleted
    }
};

module.exports = {
    upload,
    uploadToLocal,
    deleteFromLocal,
};
