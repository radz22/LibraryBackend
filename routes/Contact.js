import express from "express";
import { UserModel } from "../models/UserModel.js";
const ContactRoutes = express.Router();

ContactRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const findbyid = await UserModel.findById(id);
    if (!findbyid) {
      return res.status(401).send({ msg: "not exist" });
    }
    const findAll = findbyid.message;
    if (findAll) {
      return res.status(200).send(findAll);
    }
  } catch {
    return res.status(400).send({ msg: "invalid" });
  }
});

ContactRoutes.post("/:id/usermessage", async (req, res) => {
  try {
    const { id } = req.params;
    const { client, clientmesssage } = req.body;
    const findbyid = await UserModel.findById(id);
    if (!findbyid) {
      return res.status(401).send({ msg: "not exist" });
    }

    findbyid.message.push({
      client: client,
      clientmesssage: clientmesssage,
    });
    await findbyid.save();

    res.status(200).json(findbyid.message);
  } catch {
    return res.status(400).send({ msg: "invalid" });
  }
});

ContactRoutes.post("/:id/adminmessage", async (req, res) => {
  try {
    const { id } = req.params;
    const { admin, adminmessage } = req.body;
    const findbyid = await UserModel.findById(id);
    if (!findbyid) {
      return res.status(401).send({ msg: "not exist" });
    }

    findbyid.message.push({
      admin: admin,
      adminmessage: adminmessage,
    });
    await findbyid.save();

    res.status(200).json(findbyid.message);
  } catch {
    return res.status(400).send({ msg: "invalid" });
  }
});

ContactRoutes.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const { messageId } = req.body;

    const findbyidandDelete = await UserModel.findById(id);
    if (!findbyidandDelete) {
      return res.status(401).send({ msg: "not exist" });
    }
    findbyidandDelete.message = findbyidandDelete.message.filter(
      (messages) => messages.id !== messageId
    );
    await findbyidandDelete.save();
    return res.status(200).send({ msg: "message deleted" });
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

export default ContactRoutes;
