import express from "express";
import "dotenv/config";
import moment from "moment";
import { BookModel } from "../models/BookModer.js";
import { sendEmail } from "../Email/SendEmail.js";
import { cloudinaryExport } from "../Cloudinary/cloudinary.js";

const BooksRoutes = express.Router();

BooksRoutes.get("/", async (req, res) => {
  try {
    const findAll = await BookModel.find({});

    if (!findAll) {
      return res.status(401).send({ msg: "not found" });
    }

    return res.status(200).send(findAll);
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

BooksRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const findAll = await BookModel.findById(id);

    if (!findAll) {
      return res.status(401).send({ msg: "not found" });
    }

    return res.status(200).send(findAll);
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

BooksRoutes.post("/", async (req, res) => {
  const { photo, title, description, author } = req.body;

  try {
    if (photo) {
      const uploadedResponse = await cloudinaryExport.uploader.upload(photo, {
        upload_preset: "LibraryBook",
      });

      if (uploadedResponse) {
        const product = new BookModel({
          image: uploadedResponse.secure_url,
          publicid: uploadedResponse.public_id,
          title: title,
          description: description,
          author: author,
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

BooksRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, description } = req.body;
    const findIdAndUpdate = await BookModel.findByIdAndUpdate(id, {
      image,
      title,
      description,
    });

    if (findIdAndUpdate) {
      return res.status(200).send({ msg: "sucess update" });
    }
    if (!findIdAndUpdate) {
      return res.status(400).send({ msg: "failed update" });
    }
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

const handleSendExpirationDate = (data) => {
  sendEmail(data);
};
BooksRoutes.put("/expired/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const findId = await BookModel.findById(id);

    const updated = await BookModel.findByIdAndUpdate(id, {
      borrow: true,
    });
    findId.count++;
    await findId.save();

    if (findId) {
      findId.email = email;
      findId.save();
      const findBook = findId.title;
      const expired = moment(findId.createAt);
      const expiredate = expired.add(3, "days");

      const sendExpirationDate = {
        from: process.env.EMAIL,
        to: email,
        subject: "Overdue Library Books",
        text: ` Hello ${email},
        
        This is a friendly reminder that your "${findBook}" is set to expire on "${expiredate}". 
      
  
  
          `,
      };
      handleSendExpirationDate(sendExpirationDate);
      async function checkDate() {
        const realTimeDate = moment();
        const isBefore = realTimeDate.isBefore(expiredate);
        const data = {
          from: process.env.EMAIL,
          to: email,
          subject: "Overdue Library Books",
          text: ` Hello ${email},

          We hope this email finds you well. We wanted to remind you that
          the following ${findBook} books are currently overdue your expiration date is ${expiredate}.

            `,
        };

        if (!isBefore) {
          sendEmail(data);

          const update = await BookModel.findByIdAndUpdate(id, {
            expired: true,
          });

          clearInterval(interval);
        }
      }
      checkDate();
      const interval = setInterval(checkDate, 1000);
      return res.status(200).send({ msg: "sucess" });
    }
  } catch {
    res.status(400).send({ mgs: "invalid" });
  }
});

BooksRoutes.put("/resetExpiration/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const findIdAndUpdate = await BookModel.findByIdAndUpdate(id, {
      expired: false,
      borrow: false,
      email: "",
    });

    if (findIdAndUpdate) {
      return res.status(200).send({ msg: "sucess" });
    } else {
      return res.status(401).send({ msg: "failed" });
    }
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

BooksRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const findId = await BookModel.findById(id);

    if (findId) {
      const findPublicId = findId.publicid;
      if (findPublicId) {
        await cloudinaryExport.uploader.destroy(findPublicId);
      }
    } else {
      return res.status(401).send({ msg: "failed" });
    }

    const deletetoDatabase = await BookModel.findByIdAndDelete(id);
    if (deletetoDatabase) {
      res.status(200).send({ msg: "sucess" });
    }
  } catch (err) {
    return res.status(400).send({ msg: err });
  }
});

export default BooksRoutes;
