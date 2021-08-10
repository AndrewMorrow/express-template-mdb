import mongoose from "mongoose";

// define Token properties
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // this is the expiry time in seconds
  },
});

const Token = mongoose.model("Token", tokenSchema);

// export token
export default Token;
