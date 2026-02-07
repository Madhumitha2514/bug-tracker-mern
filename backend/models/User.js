import mongoose from "mongoose";  // load mangoose library

const userSchema = new mongoose.Schema(    //define databse structure
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
  },
  { timestamps: true }  // in mangodb it automatically create the created at by just using this timestamp
);

const User = mongoose.model("User", userSchema); //creates collection

export default User;
