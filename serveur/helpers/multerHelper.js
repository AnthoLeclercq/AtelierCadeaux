const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = () => {
    const destination = path.join(__dirname, '..', 'images');

    return multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const originalName = path.parse(file.originalname).name;
            const uniqueSuffix = Date.now();
            const simplifiedName = `${originalName}-${uniqueSuffix}${path.extname(file.originalname)}`;
            cb(null, simplifiedName);
        },
    });
};

const getMulterInstance = () => {
    return multer({ storage: createStorage() });
};

module.exports = { getMulterInstance };