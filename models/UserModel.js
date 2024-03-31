import mongoose from "mongoose";

const userMessage = new mongoose.Schema({
  client: {
    type: String,
    required: false,
  },
  clientmesssage: {
    type: String,
    required: false,
  },

  admin: {
    type: String,
    required: false,
  },
  adminmessage: {
    type: String,
    required: false,
  },
});

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  usertype: {
    type: String,
    default: "user",
  },
  message: [userMessage],
});

export const UserModel = mongoose.model("User", UserSchema);
