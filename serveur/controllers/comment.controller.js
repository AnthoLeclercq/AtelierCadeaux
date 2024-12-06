const Comment = require("../models/comment.model.js");

/************ Create new Comment ***********************/
exports.addComment = (req, res) => {
    const newComment = {
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        content: req.body.content,
        rating: req.body.rating,
    };

    Comment.create(newComment, (err, response) => {
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

/************ Get all Comments ***********************/
exports.getAllComments = (req, res) => {
    Comment.getAllComments((err, response) => {
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

/************ Get Comment by ID ***********************/
exports.getCommentById = (req, res) => {
    const comment_id = req.params.comment_id;
    Comment.getCommentByID(comment_id, (err, response) => {
        if (err) {
            return res.status(response.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            data: response.data,
            status: response.status,
            message: response.msg,
        });
    });
};

/************ Get Comments by Product ID ***********************/
exports.getCommentsByProductId = (req, res) => {
    const product_id = req.params.product_id;
    Comment.getCommentsByProductID(product_id, (err, response) => {
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

/************ Update Comment by ID ***********************/
exports.updateComment = (req, res) => {
    const comment_id = req.params.comment_id;
    const updatedData = req.body;

    Comment.updateCommentByID(comment_id, updatedData, (err, response) => {
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

/************ Delete Comment by ID ***********************/
exports.deleteComment = (req, res) => {
    const comment_id = req.params.comment_id;

    Comment.deleteCommentByID(comment_id, (err, response) => {
        if (err) {
            return res.status(err.status).json({ message: err.msg });
        }
        res.status(response.status).json({
            message: response.msg,
            status: response.status,
        });
    });
};
