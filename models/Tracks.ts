import mongoose from "mongoose";
const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  version: String,
  artist: String,
  isrc: {
    type: String,
    required: true,
  },
  pLine: String,
  aliases: [String],
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
  },
});
export default mongoose.model("Track", trackSchema);
