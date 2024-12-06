const Meta = require("../models/meta.model.js");

exports.getAllMetasExceptSubcategories = (req, res) => {
    Meta.getAllMetasExceptSubcategories((err, data) => {
        if (err) {
            res.status(err.status).send({
                message: err.msg
            });
        } else {
            res.status(data.status).send(data);
        }
    });
};

exports.getSubcategoriesByCategory = (req, res) => {
    const category = req.params.category;

    Meta.getSubcategoriesByCategory(category, (err, data) => {
        if (err) {
            res.status(err.status).send({
                message: err.msg
            });
        } else {
            res.status(data.status).send(data);
        }
    });
};
