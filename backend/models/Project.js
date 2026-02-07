import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {               //1.project name required
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    owner: {                                      //2.owner- project creator
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [                                      //3. team members who invited
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }                            //createdAt
);

export default mongoose.model("Project", projectSchema);
