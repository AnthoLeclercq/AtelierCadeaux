const ProductMeta = require("../models/productMeta.model.js");

/************ Create new Product Meta ***********************/
exports.addProductMeta = (req, res) => {
    const newProductMeta = {
        product_id: req.body.product_id,
        meta_id: req.body.meta_id,
        meta_value: req.body.meta_value,
    };

    ProductMeta.create(newProductMeta, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            message: response.msg,
            data: response.data,
            status: response.status,
        });
    });
};

/************ Get Product Meta by Product Meta ID ***********************/
exports.getProductMetaById = (req, res) => {
    const product_meta_id = req.params.product_meta_id;
    ProductMeta.getById(product_meta_id, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            data: response.data,
            status: response.status,
            message: response.msg,
        });
    });
};

/************ Get Product Metas by Product ID ***********************/
exports.getProductMetasByProductId = (req, res) => {
    const product_id = req.params.product_id;
    ProductMeta.getByProductId(product_id, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            data: response.data,
            status: response.status,
            message: response.msg,
        });
    });
};

/************ Get Product ID by specific Meta Values ***********************/
exports.getProductIdByMetaValues = (req, res) => {
    const metaValues = req.body.metaValues; // Assuming the meta values are sent in the body of the request

    if (!Array.isArray(metaValues) || metaValues.length === 0) {
        return res.status(400).json({ message: "metaValues should be a non-empty array" });
    }

    ProductMeta.getProductIdByMetaValues(metaValues, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            data: response.data,
            status: response.status,
            message: response.msg,
        });
    });
};

/************ Get All Product Metas ***********************/
exports.getAllProductMetas = (req, res) => {
    ProductMeta.getAll((err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            data: response.data,
            status: response.status,
            message: response.msg,
        });
    });
};

/************ Update Product Meta by Product Meta ID ***********************/
exports.updateProductMetaById = (req, res) => {
    const product_meta_id = req.params.product_meta_id;
    const updatedData = req.body;

    ProductMeta.updateById(product_meta_id, updatedData, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            message: response.msg,
            status: response.status,
        });
    });
};

/************ Delete Product Meta by Product Meta ID ***********************/
exports.deleteProductMetaById = (req, res) => {
    const product_meta_id = req.params.product_meta_id;

    ProductMeta.deleteById(product_meta_id, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            message: response.msg,
            status: response.status,
        });
    });
};

/************ Delete Product Metas by Product ID ***********************/
exports.deleteProductMetasByProductId = (req, res) => {
    const product_id = req.params.product_id;

    ProductMeta.deleteByProductId(product_id, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            message: response.msg,
            status: response.status,
        });
    });
};
