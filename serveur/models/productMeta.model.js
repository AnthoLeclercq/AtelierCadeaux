const db = require("../helpers/database.js");

// Constructor
const ProductMeta = function (productMeta) {
    this.product_meta_id = productMeta.product_meta_id;
    this.product_id = productMeta.product_id;
    this.meta_id = productMeta.meta_id;
    this.meta_value = productMeta.meta_value;
};

// Create new ProductMeta
ProductMeta.create = (newProductMeta, result) => {
    const insertQuery = `INSERT INTO product_meta (product_id, meta_id, meta_value) VALUES (?, ?, ?)`;
    const values = [newProductMeta.product_id, newProductMeta.meta_id, JSON.stringify(newProductMeta.meta_value)];

    db.query(insertQuery, values, (err, res) => {
        if (err) {
            return result({ status: 400, msg: err });
        }
        const createdProductMeta = {
            product_meta_id: res.insertId,
            ...newProductMeta
        };
        result(null, {
            status: 201,
            msg: "Product Meta added with success!",
            data: createdProductMeta,
        });
    });
};

// Get ProductMeta by Product Meta ID
ProductMeta.getById = (product_meta_id, result) => {
    const selectQuery = `SELECT * FROM product_meta WHERE product_meta_id = ?`;
    const values = [product_meta_id];

    db.query(selectQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.length === 0) {
            return result(null, { status: 404, msg: "No Product Meta found!" });
        }
        result(null, {
            status: 200,
            msg: "Get Product Meta with success!",
            data: res[0],
        });
    });
};

// Get all ProductMetas by Product ID
ProductMeta.getByProductId = (product_id, result) => {
    const selectQuery = `SELECT * FROM product_meta WHERE product_id = ?`;
    const values = [product_id];

    db.query(selectQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.length === 0) {
            return result(null, { status: 404, msg: "No Product Meta found!" });
        }
        result(null, {
            status: 200,
            msg: "Get Product Meta with success!",
            data: res,
        });
    });
};

// Get Product ID by specific Meta Values in Meta Value JSON
ProductMeta.getProductIdByMetaValues = (metaValues, result) => {
    if (!Array.isArray(metaValues) || metaValues.length === 0) {
        return result({ status: 400, msg: "metaValues should be a non-empty array" });
    }

    // Générer les placeholders pour les meta values
    const placeholders = metaValues.map(() => '?').join(',');
    const countMetaValues = metaValues.length;

    // Requête SQL pour trouver les product_id correspondant à tous les meta_values
    const selectQuery = `
        SELECT product_id
        FROM product_meta
        WHERE meta_value IN (${placeholders})
        GROUP BY product_id
        HAVING COUNT(DISTINCT meta_value) = ?
    `;

    const values = [...metaValues, countMetaValues];

    db.query(selectQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err.message });
        }
        if (res.length === 0) {
            return result(null, { status: 404, msg: "No Product ID found with the given meta values!" });
        }
        result(null, {
            status: 200,
            msg: "Get Product ID with success!",
            data: res.map(row => row.product_id),
        });
    });
};

// Get all ProductMetas
ProductMeta.getAll = (result) => {
    const selectQuery = `SELECT * FROM product_meta`;

    db.query(selectQuery, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.length === 0) {
            return result(null, { status: 404, msg: "No Product Meta found!" });
        }
        result(null, {
            status: 200,
            msg: "Get all Product Meta with success!",
            data: res,
        });
    });
};

// Update ProductMeta by Product Meta ID
ProductMeta.updateById = (product_meta_id, updatedData, result) => {
    const updateQuery = `UPDATE product_meta SET ? WHERE product_meta_id = ?`;
    const values = [updatedData, product_meta_id];

    db.query(updateQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.affectedRows === 0) {
            return result(null, {
                status: 404,
                msg: `Product Meta with ID ${product_meta_id} not found`,
            });
        }
        result(null, {
            status: 200,
            msg: `Product Meta with ID ${product_meta_id} updated successfully`,
        });
    });
};

// Delete ProductMeta by Product Meta ID
ProductMeta.deleteById = (product_meta_id, result) => {
    const deleteQuery = `DELETE FROM product_meta WHERE product_meta_id = ?`;
    const values = [product_meta_id];

    db.query(deleteQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.affectedRows === 0) {
            return result(null, {
                status: 404,
                msg: `Product Meta with ID ${product_meta_id} not found`,
            });
        }
        result(null, {
            status: 200,
            msg: `Product Meta with ID ${product_meta_id} deleted successfully`,
        });
    });
};

// Delete all ProductMetas by Product ID
ProductMeta.deleteByProductId = (product_id, result) => {
    const deleteQuery = `DELETE FROM product_meta WHERE product_id = ?`;
    const values = [product_id];

    db.query(deleteQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.affectedRows === 0) {
            return result(null, {
                status: 404,
                msg: `No Product Meta found for Product ID ${product_id}`,
            });
        }
        result(null, {
            status: 200,
            msg: `All Product Metas for Product ID ${product_id} deleted successfully`,
        });
    });
};

module.exports = ProductMeta;
