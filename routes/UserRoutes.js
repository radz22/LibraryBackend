import express from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import { UserModel } from "../models/UserModel.js";
import { SendEmail } from "../Email/SendEmail.js";

const UserRoutes = express.Router();
const saltRound = 10;

UserRoutes.post("/signup", async (req, res) => {
  try {
    const hash = await bcrypt.genSalt(saltRound);
    const { name, email, password } = req.body;

    const data = {
      name,
      email,
      password: await bcrypt.hash(password, hash),
    };

    const createUser = await UserModel.create(data);

    if (createUser) {
      return res.status(200).send({ msg: "create" });
    } else {
      return res.status(401).send({ msg: "Failed" });
    }
  } catch {
    return res.status(400).send({ msg: `user is existing` });
  }
});

UserRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const findEmail = await UserModel.findOne({ email });
    const findId = findEmail.id;
    if (!findEmail) {
      return res.status(401).send({ msg: "email not found" });
    }

    const findPassword = findEmail.password;
    const finduserType = findEmail.usertype;
    const matchpass = await bcrypt.compare(password, findPassword);

    if (matchpass) {
      return res.status(200).send({ type: finduserType, id: findId });
    } else {
      return res.status(400).send({ msg: "failed" });
    }
  } catch {
    return res.status(400).send({ msg: "invalid" });
  }
});

UserRoutes.post("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    const findEmail = await UserModel.findOne({ email });

    if (!findEmail) {
      return res.status(401).send({ msg: "no email found" });
    }
    const findId = findEmail._id;
    const findemail = findEmail.email;
    const findName = findEmail.name;

    const data = {
      from: process.env.EMAIL,
      to: findemail,
      subject: "Request for Reset Password",
      text: `Hello ${findName},

      We received a request to reset your password for the [Company Name] account. If you didn't make this request, you can safely ignore this email.
      To reset your password, click the following link:
      ${`http://localhost:5173/resetpassword/${findId}`}
      
      
      If you have any questions or need further assistance, please contact our support team at ${
        process.env.EMAIL
      }.
      
      Best regards,

      `,
    };

    const response = SendEmail(data);
    if (response) {
      return res.status(200).send({ msg: "sucess" });
    }
  } catch {
    console.log("error");
  }
});

UserRoutes.get("/userpick/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const pickid = await UserModel.findById(id);
    if (pickid) {
      res.status(200).send(pickid);
    }
    if (!pickid) {
      res.status(401).send("no user");
    }
  } catch {
    res.status(400).send({ msg: "invalid" });
  }
});

UserRoutes.put("/reset_password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hash = await bcrypt.genSalt(saltRound);

    const findId = await UserModel.findByIdAndUpdate(id, {
      password: await bcrypt.hash(password, hash),
    });

    if (findId) {
      return res.status(200).send({ msg: "sucess updated" });
    }
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

UserRoutes.get("/", async (req, res) => {
  try {
    const findAll = await UserModel.find({});

    if (findAll) {
      return res.status(200).send({ findAll });
    }
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

export default UserRoutes;
