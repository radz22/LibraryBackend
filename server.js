import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import BooksRoutes from "./routes/BookRoutes.js";
import CommentRoutes from "./routes/CommentRoutes.js";
import ContactRoutes from "./routes/Contact.js";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use("/userRoutes", UserRoutes);
app.use("/booksRoutes", BooksRoutes);
app.use("/commentRoutes", CommentRoutes);
app.use("/contactRoutes", ContactRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`running port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
