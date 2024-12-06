const Product = require("../models/product.model.js");
const alfredService = require("../services/alfred.service.js");

/************ Create new Product ***********************/
exports.addProduct = async (req, res) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    images_product: req.body.images_product,
    artisan_id: req.params.artisan_id,
  };

  try {
    Product.create(newProduct, req.params.artisan_id, async (err, createdProduct) => {
      if (err) {
        return res.status(400).json({ message: err.msg || "Failed to create product" });
      }

      try {
        const predictionData = await alfredService.getPrediction(newProduct.name);
        res.status(201).json({
          message: "Product added with success!",
          data: createdProduct,
          prediction: predictionData,
        });
      } catch (error) {
        console.error("Error fetching prediction from Alfred:", error);
        res.status(201).json({
          message: "Product added with success, but prediction failed.",
          data: createdProduct,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/************ Get all Products ***********************/
exports.getAllProducts = (req, res) => {
  Product.getAllProducts((err, response) => {
    if (err) {
      return res.status(err.status).json({ message: err.msg });
    }
    res.status(response.status).json({
      data: response.data,
      message: response.msg,
      status: response.status,
    });
  });
};

/************ Get Product by ID ***********************/
exports.getProductById = (req, res) => {
  const product_id = req.params.product_id;
  Product.getProductByID(product_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: err });
    }
    res.status(response.status).json({
      data: response.data,
      status: response.status,
      message: response.msg,
    });
  });
};

/************ Get Products by Artisan ID ***********************/
exports.getProductsByArtisanId = (req, res) => {
  const artisan_id = req.params.artisan_id;
  Product.getProductsByArtisanId(artisan_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: response.msg });
    }
    res.status(response.status).json({
      data: response.data,
      status: response.status,
      message: response.msg,
    });
  });
};

/************ Update Product by ID ***********************/
exports.updateProduct = (req, res) => {
  const productIdToUpdate = req.params.product_id;
  const updatedData = req.body;

  Product.getProductByID(productIdToUpdate, (err, product) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.data.artisan_id !== req.user.user_id) {
      return res.status(403).json({
        message: `Access denied: You don't have permission. An artisan with ID ${product.data.artisan_id} is required.`,
      });
    }

    Product.updateProductByID(productIdToUpdate, updatedData, (err, response) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      res.status(response.status).json({
        message: response.msg,
        data: response.data,
        status: response.status,
      });
    });
  });
};

/************ Delete Product by ID ***********************/
exports.deleteProduct = (req, res) => {
  const product_id = req.params.product_id;

  Product.getProductByID(product_id, (err, response) => {
    if (err) {
      return res.status(response.status).json({ message: err });
    }
    if (response.status === 404) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (response.data.artisan_id !== req.user.user_id) {
      return res.status(403).json({
        message: `Access denied: You don't have permission. An artisan with ID ${response.data.artisan_id} is required.`,
      });
    }

    // Then delete the product_id
    Product.deleteProductByID(product_id, (deleteErr, deleteRes) => {
      if (deleteErr) {
        return res.status(deleteRes.status).json({ message: deleteRes.msg });
      }
      res.status(deleteRes.status).json({
        message: deleteRes.msg,
        status: deleteRes.status,
      });
    });
  });
};

/********************* Delete product image *******************/
exports.deleteUserImage = (req, res) => {
  const product_id = req.params.product_id;
  const imageUrl = req.body.imageUrl; // The URL of the image to delete

  if (!imageUrl) {
    return res.status(400).json({ status: 400, message: "Image URL is required for images_product" });
  }

  Product.deleteImage(product_id, imageUrl, (err, response) => {
    if (err) {
      return res.status(response.status || 500).json({ status: response.status || 500, message: err.message || response.msg });
    }
    res.status(response.status).json({ status: response.status, message: response.msg });
  });
};

