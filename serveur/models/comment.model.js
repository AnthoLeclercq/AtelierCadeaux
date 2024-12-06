const db = require("../helpers/database.js");

// Constructor
const Comment = function (comment) {
    this.comment_id = comment.comment_id;
    this.product_id = comment.product_id;
    this.user_id = comment.user_id;
    this.content = comment.content;
    this.rating = comment.rating;
};

/************ Create and Save a new Comment ***********************/
Comment.create = (newComment, result) => {
    const insertQuery = `INSERT INTO comments (product_id, user_id, content, rating)
        VALUES (?, ?, ?, ?)`;

    const values = [
        newComment.product_id,
        newComment.user_id,
        newComment.content,
        newComment.rating
    ];

    db.query(insertQuery, values, (err, res) => {
        if (err) {
            result({ status: 400, msg: err });
        } else {
            const createdComment = {
                comment_id: res.insertId,
                product_id: newComment.product_id,
                user_id: newComment.user_id,
                content: newComment.content,
                rating: newComment.rating,
            };
            result(null, {
                status: 201,
                msg: "Comment added with success!",
                data: createdComment,
            });
        }
    });
};

/************ Get all Comments ***********************/
Comment.getAllComments = (result) => {
    const selectQuery = `SELECT * FROM comments`;

    db.query(selectQuery, (err, res) => {
        if (err) {
            result({ status: 500, msg: err });
        } else {
            if (res.length === 0) {
                result(null, { status: 404, msg: "No comments found!" });
            } else {
                result(null, {
                    status: 200,
                    msg: "Get all comments with success!",
                    data: res,
                });
            }
        }
    });
};

/************ Get Comment by ID ***********************/
Comment.getCommentByID = (comment_id, result) => {
    const selectQuery = `SELECT * FROM comments WHERE comment_id = ?`;
    const values = [comment_id];

    db.query(selectQuery, values, (err, res) => {
        if (err) {
            result({ status: 500, msg: err });
        } else {
            if (res.length === 0) {
                result(null, { status: 404, msg: "Comment not found!" });
            } else {
                result(null, {
                    status: 200,
                    msg: "Get comment with success!",
                    data: res[0],
                });
            }
        }
    });
};

/************ Get Comments by Product ID ***********************/
Comment.getCommentsByProductID = (product_id, result) => {
    const selectQuery = `SELECT * FROM comments WHERE product_id = ?`;
    const values = [product_id];

    db.query(selectQuery, values, (err, res) => {
        if (err) {
            result({ status: 500, msg: err });
        } else {
            if (res.length === 0) {
                result(null, { status: 404, msg: "No comments found for this product!" });
            } else {
                result(null, {
                    status: 200,
                    msg: "Get comments with success!",
                    data: res,
                });
            }
        }
    });
};

/************ Update Comment by ID ***********************/
Comment.updateCommentByID = (comment_id, commentUpdate, result) => {
    // Initialize variables
    let setClause = [];
    let values = [];

    // Build the SET clause dynamically based on provided fields
    for (const [key, value] of Object.entries(commentUpdate)) {
        if (key === 'content' || key === 'rating') {
            setClause.push(`${key} = ?`);
            values.push(value);
        }
    }

    // Ensure there is something to update
    if (setClause.length === 0) {
        return result(null, { status: 400, msg: "No valid fields to update!" });
    }

    // Add comment_id to the values array
    values.push(comment_id);

    // Construct the update query with the dynamic SET clause
    const updateQuery = `UPDATE comments SET ${setClause.join(', ')} WHERE comment_id = ?`;

    db.query(updateQuery, values, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.affectedRows === 0) {
            return result(null, { status: 404, msg: "Comment not found!" });
        }

        // Retrieve the updated comment
        const selectQuery = `SELECT * FROM comments WHERE comment_id = ?`;
        db.query(selectQuery, [comment_id], (err, selectRes) => {
            if (err) {
                return result({ status: 500, msg: err });
            }
            result(null, {
                status: 200,
                msg: "Comment updated successfully!",
                data: selectRes[0],
            });
        });
    });
};

/************ Delete Comment by ID ***********************/
Comment.deleteCommentByID = (comment_id, result) => {
    const deleteQuery = `DELETE FROM comments WHERE comment_id = ?`;
    const values = [comment_id];

    db.query(deleteQuery, values, (err, res) => {
        if (err) {
            result({ status: 500, msg: err });
        } else {
            if (res.affectedRows == 0) {
                result(null, { status: 404, msg: "Comment not found!" });
            } else {
                result(null, {
                    status: 200,
                    msg: "Comment deleted successfully!",
                });
            }
        }
    });
};

module.exports = Comment;
