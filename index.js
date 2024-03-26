var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import Track from "./models/Tracks.js";
import Contract from "./models/Contracts.js";
import "dotenv/config";
import { readExcelFile } from "./readExcel.js";
export const createContractIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    try {
        const existingContract = yield Contract.findOne({ name: "Contract 1" });
        if (!existingContract) {
            const newContract = new Contract({ name: "Contract 1" });
            yield newContract.save();
            console.log("Contract created:", newContract);
        }
        else {
            console.log("Contract already exists:", existingContract);
        }
    }
    catch (err) {
        errors.push("Error creating contract");
        console.error("Error creating contract:", err);
    }
    return errors;
});
export const ingestData = (jsonData) => __awaiter(void 0, void 0, void 0, function* () {
    const error = [];
    for (let index = 0; index < jsonData.length; index++) {
        const row = jsonData[index];
        const aliases = row.Aliases.split(";").map((alias) => alias.trim());
        let contractId = null;
        if (row.Contract) {
            const existingContract = yield Contract.findOne({ name: row.Contract });
            if (existingContract) {
                contractId = existingContract._id;
            }
            else {
                error.push(`Error on line ${index}: Contract "${row.Contract}" not found for track "${row.Title}"`);
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
            yield track.validate(); // Validate the track against the schema
            yield track.save(); // Save the track if it's valid
        }
        catch (validationError) {
            error.push(`Error on line ${index + 2}: ${validationError.message}`);
        }
    }
    // Log the errors to the console
    if (error.length > 0) {
        console.error("Errors found during ingestion:");
        error.forEach((err) => console.error(err));
    }
    else {
        console.log("All tracks ingested successfully.");
        return "All tracks ingested successfully.";
    }
    return error;
});
if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the .env file");
}
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
    console.log("Connected to MongoDB");
    createContractIfNotExists();
    const jsonData = readExcelFile(`details/Track Import Test.xlsx`);
    ingestData(jsonData);
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
