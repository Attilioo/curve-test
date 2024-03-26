import mongoose from "mongoose";
import Track from "./models/Tracks";
import Contract from "./models/Contracts";
import "dotenv/config";

export const createContractIfNotExists = async () => {
  const errors: String[] = [];
  try {
    const existingContract = await Contract.findOne({ name: "Contract 1" });
    if (!existingContract) {
      const newContract = new Contract({ name: "Contract 1" });
      await newContract.save();
      console.log("Contract created:", newContract);
    } else {
      console.log("Contract already exists:", existingContract);
    }
  } catch (err) {
    errors.push("Error creating contract");
    console.error("Error creating contract:", err);
  }
  return errors;
};
