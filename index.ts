import mongoose from "mongoose";
import Track from "./models/Tracks.js";
import Contract from "./models/Contracts.js";
import "dotenv/config";
import { readExcelFile } from "./readExcel.js";

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

export const ingestData = async (jsonData: any) => {
  const error = [];
  for (let index = 0; index < jsonData.length; index++) {
    const row = jsonData[index];
    //Step 4 - aliases split by semicolon and remove any unecessary extra space 
    const aliases = row.Aliases.split(";").map((alias: string) => alias.trim());

    //This is the operations needed for Step 5
    let contractId = null;

    if (row.Contract) {
      const existingContract = await Contract.findOne({ name: row.Contract });
      if (existingContract) {
        contractId = existingContract._id;
      } else {
        error.push(
          `Error on line ${index}: Contract "${row.Contract}" not found for track "${row.Title}"`
        );
        continue;
      }
    }

    const track = new Track({
      title: row.Title,
      version: row.Version,
      artist: row.Artist,
      isrc: row.ISRC,
      pLine: row["P Line"],
      aliases: aliases,
      contractId: contractId,
    });

    try {
      await track.validate(); 
      await track.save();
    } catch (validationError: any) {
      error.push(`Error on line ${index + 2}: ${validationError.message}`);
    }
  }

  // Log the errors to the console
  if (error.length > 0) {
    console.error("Errors found during ingestion:");
    error.forEach((err) => console.error(err));
  } else {
    console.log("All tracks ingested successfully.");
    return "All tracks ingested successfully.";
  }
  return error;
};

if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined in the .env file");
}
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    createContractIfNotExists();
    const jsonData = readExcelFile(
      `details/Track Import Test.xlsx`
    );
    ingestData(jsonData);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
