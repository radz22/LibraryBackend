import { BookModel } from "../models/BookModer.js";

import express from "express";
const CommentRoutes = express.Router();

CommentRoutes.get("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const findAll = await BookModel.findById(id);

    if (!findAll) {
      return res.status(401).send({ msg: "not found" });
    }

    const findCommentAll = findAll.comments;
    if (findCommentAll) {
      return res.status(200).send(findCommentAll);
    }
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

CommentRoutes.post("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, email } = req.body;

    const findId = await BookModel.findById(id);

    if (!findId) {
      return res.status(401).send({ msg: "not found" });
    }
    findId.comments.push({ email: email, comment: comment });
    await findId.save();

    res.status(201).json(findId.comments);
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

CommentRoutes.put("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId, comment } = req.body;
    const findIdAndUpdate = await BookModel.findById(id);
    if (!findIdAndUpdate) {
      return res.status(401).send({ msg: "not found" });
    }

    const comments = findIdAndUpdate.comments.find(
      (comment) => comment.id === commentId
    );

    if (!comments) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comments.comment = comment;
    await findIdAndUpdate.save();

    res.json(comments);
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

CommentRoutes.put("/:id/admintoggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { editid } = req.body;

    const findbyid = await BookModel.findById(id);
    if (!findbyid) {
      return res.status(401).send({ msg: "not found" });
    }
    const comments = findbyid.comments.find((comment) => comment.id === editid);

    comments.isOpen = !comments.isOpen;
    await findbyid.save();
    res.json(comments);
  } catch {
    return res.status(400).send({ msg: "invalid" });
  }
});

CommentRoutes.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId } = req.body;
    const findIdAndDelete = await BookModel.findById(id);
    if (!findIdAndDelete) {
      return res.status(401).send({ msg: "not found" });
    }

    findIdAndDelete.comments = findIdAndDelete.comments.filter(
      (comment) => comment.id !== commentId
    );

    await findIdAndDelete.save();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

export default CommentRoutes;
