const { getMulterInstance } = require('./multerHelper');
const fs = require('fs');
const path = require('path');

const uploadImages = (req, res) => {
  const uploadFiles = getMulterInstance();
  const upload = uploadFiles.array('images');

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/images/`;
    console.log("baseurl:",baseUrl)
    const fileUrls = req.files.map(file => `${baseUrl}${file.filename}`);
    console.log("fileurl:",fileUrls)
    res.status(200).json({ message: 'Images uploaded successfully!', fileUrls });
  });
};

const deleteImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'images', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  });
};

module.exports = { uploadImages, deleteImage };