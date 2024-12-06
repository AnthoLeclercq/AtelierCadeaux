const db = require("../helpers/database.js");

const Product = function (product) {
  this.product_id = product.product_id;
  this.artisan_id = product.artisan_id;
  this.name = product.name;
  this.description = product.description;
  this.price = product.price;
  this.images_product = product.images_product;
  this.is_deleted = product.is_deleted;
};

/************ Create and Save a new Product ***********************/
Product.create = (newProduct, artisanId, result) => {
  const insertQuery = `INSERT INTO products (artisan_id, name, description, price, images_product)
        VALUES (?, ?, ?, ?, ?)`;

  const values = [
    artisanId,
    newProduct.name,
    newProduct.description,
    newProduct.price,
    JSON.stringify(newProduct.images_product),
  ];

  db.query(insertQuery, values, (err, res) => {
    if (err) {
      return result(err, null);
    }

    const createdProduct = {
      product_id: res.insertId,
      artisan_id: artisanId,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      images_product: newProduct.images_product,
    };
    result(null, createdProduct);
  });
};

/************ Get all Products ***********************/
Product.getAllProducts = (result) => {
  const selectQuery = `SELECT * FROM products`;

  db.query(selectQuery, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "No products found!" });
      } else {
        result(null, {
          status: 200,
          msg: "Get all products with success!",
          data: res,
        });
      }
    }
  });
};

/************ Get Product by ID ***********************/
Product.getProductByID = (product_id, result) => {
  const selectQuery = `SELECT * FROM products WHERE product_id = ?`;
  const values = [product_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, { status: 404, msg: "Product not found!" });
      } else {
        result(null, {
          status: 200,
          msg: "Get product with success!",
          data: res[0],
        });
      }
    }
  });
};

/************ Get Products by Artisan ID ***********************/
Product.getProductsByArtisanId = (artisan_id, result) => {
  const selectQuery = `SELECT * FROM products WHERE artisan_id = ?`;
  const values = [artisan_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result({ status: 500, msg: err });
    } else {
      if (res.length === 0) {
        result(null, {
          status: 404,
          msg: "Products not found!",
          data: [],
        });
      } else {
        result(null, {
          status: 200,
          msg: "Get products with success!",
          data: res,
        });
      }
    }
  });
};

/************ Update Product ***********************/
Product.updateProductByID = (product_id, productUpdate, result) => {
  // Build the SET clause dynamically
  let setClause = [];
  let values = [];

  // Iterate over userUpdate fields
  for (const [key, value] of Object.entries(productUpdate)) {
    if (key === 'images_product') {
      // Ensure that images_detail is a JSON string
      setClause.push(`${key} = ?`);
      values.push(JSON.stringify(value));
    } else {
      setClause.push(`${key} = ?`);
      values.push(value);
    }
  }

  // Add user_id to the values array
  values.push(product_id);

  // Join the setClause array into a string
  const updateQuery = `UPDATE products SET ${setClause.join(', ')} WHERE product_id = ?`;

  db.query(updateQuery, values, (err, updateRes) => {
    if (err) {
      console.error("Error updating product:", err);
      return result(err, null);
    }

    // Retrieve the updated user
    const selectQuery = `SELECT * FROM products WHERE product_id = ?`;

    db.query(selectQuery, [product_id], (err, selectRes) => {
      if (err) {
        console.error("Error retrieving updated product:", err);
        return result(err, null);
      }

      if (selectRes.length === 0) {
        return result(null, {
          status: 404,
          msg: `Updated product with ID ${product_id} not found`,
        });
      }

      const updatedProduct = selectRes[0];

      result(null, {
        status: 200,
        msg: `Product with ID ${product_id} updated successfully`,
        data: new Product(updatedProduct),
      });
    });
  });
};

/************ Delete Product by ID ***********************/
Product.deleteProductByID = (product_id, result) => {
  const query = `DELETE FROM products WHERE product_id = ?`;
  const values = [product_id];

  db.query(query, values, (err, res) => {
    if (err) {
      console.error("Error deleting product:", err);
      return result({ status: 500, msg: err });
    }

    if (res.affectedRows === 0) {
      return result(null, {
        status: 404,
        msg: `Product with ID ${product_id} not found`,
      });
    }

    result(null, {
      status: 200,
      msg: `Product with ID ${product_id} deleted successfully`,
    });
  });
};

/************ Get Products by User ID ***********************/
Product.getProductByUserID = (user_id, result) => {
  const selectQuery = `SELECT * FROM products WHERE artisan_id = ?`;
  const values = [user_id];

  db.query(selectQuery, values, (err, res) => {
    if (err) {
      result({ status: 500, msg: err, data: null });
    } else {
      if (res.length === 0) {
        result(null, {
          status: 404,
          msg: "No products found for the specified artisan ID",
          data: [],
        });
      } else {
        result(null, { status: 200, msg: "Get product with success!", data: res });
      }
    }
  });
};

/********************* Delete product image *******************/
Product.deleteImage = (product_id, imageUrl, result) => {
  const selectQuery = `SELECT images_product FROM products WHERE product_id = ?`;
  db.query(selectQuery, [product_id], (err, res) => {
    if (err) {
      console.error("Error retrieving product:", err);
      return result(err, null);
    }

    if (res.length === 0) {
      return result(null, { status: 404, msg: `Product with ID ${product_id} not found` });
    }

    let imagesProduct = res[0].images_product;

    // Check if imagesProduct is a string that needs parsing
    if (typeof imagesProduct === 'string') {
      try {
        imagesProduct = JSON.parse(imagesProduct);
      } catch (parseErr) {
        return result(null, { status: 500, msg: `Error parsing images_product: ${parseErr.message}` });
      }
    }

    // Ensure imagesProduct is an array
    if (!Array.isArray(imagesProduct)) {
      return result(null, { status: 500, msg: `Invalid format for images_product` });
    }

    const indexToRemove = imagesProduct.indexOf(imageUrl);

    if (indexToRemove > -1) {
      if (imagesProduct.length === 1) {
        // If only one image is left
        return result(null, { status: 400, msg: `Cannot delete the last image` });
      }

      imagesProduct.splice(indexToRemove, 1); // Remove the image URL
    } else {
      return result(null, { status: 400, msg: `Image URL not found in images_product` });
    }

    const updateQuery = `UPDATE products SET images_product = ? WHERE product_id = ?`;
    const values = [JSON.stringify(imagesProduct), product_id];

    db.query(updateQuery, values, (err, res) => {
      if (err) {
        console.error("Error updating product:", err);
        return result(err, null);
      }

      result(null, {
        status: 200,
        msg: `Image ${imageUrl} removed from images_product successfully`,
      });
    });
  });
};


module.exports = Product;
