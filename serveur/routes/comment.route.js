const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller.js");

/************ Create new comment ***********************/
router.post("/", commentController.addComment);

/************ Get all comments ***********************/
router.get("/", commentController.getAllComments);

/************ Get comment by ID ***********************/
router.get("/:comment_id", commentController.getCommentById);

/************ Get comments by product ID ***********************/
router.get("/product/:product_id", commentController.getCommentsByProductId);

/************ Update comment by ID ***********************/
router.put("/:comment_id", commentController.updateComment);

/************ Delete comment by ID ***********************/
router.delete("/:comment_id", commentController.deleteComment);

module.exports = router;
