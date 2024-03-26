import mongoose from "mongoose";
const contractSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
export default mongoose.model("Contract", contractSchema);
