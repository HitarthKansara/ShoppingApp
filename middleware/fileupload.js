const multer = require('multer');
const path = require('path');

// Define the storage location and file naming strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Set the uploads folder as the destination
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {

            console.log('file--->', file);
            isErrorFileType = true
            req.isErrorFileType = isErrorFileType;
            // cb(new Error('Invalid file type. Only JPEG and PNG images are allowed.'));
            cb(null, true);
        }
    },
});

module.exports = (req, res, next) => {
    // Using custom error handling middleware
    upload.array('images', 5)(req, res, (error) => {
        if (error) {

            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size limit exceeded. Max size is 5MB' });
            } else if (error.code == 'LIMIT_UNEXPECTED_FILE')
                return res.status(400).json({ message: 'File limit exceeded. Max 5 files can be uploaded' });
        }
        next();

    });
};


