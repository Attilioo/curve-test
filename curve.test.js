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
import { assert } from "chai";
before(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL environment variable is not set");
    }
    yield mongoose.connect(process.env.MONGODB_URL);
})); //In a scenario outside of the test I would make sure that the DB used was a test one, of course I would not delete everything off the database.
//for the sake of the test I do delete all the data from the DB.
after(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Track.deleteMany({});
    yield Contract.deleteMany({});
    console.log("Track & Contract collection cleared");
}));
describe("Database Connection", () => {
    it("should connect to the database successfully", (done) => {
        const mongoDbUrl = process.env.MONGODB_URL;
        if (!mongoDbUrl) {
            throw new Error("MONGODB_URL is not defined in the .env file");
        }
        mongoose.connect(mongoDbUrl).then(() => {
            assert(mongoose.connection.readyState === 1);
            done();
        });
    });
});
describe("Contract", () => {
    it("should receive a new contract and add it to the DB", (done) => {
        const newContract = new Contract({ name: "This Contract Exists!" });
        newContract.save().then(() => {
            Contract.findOne({ name: "This Contract Exists!" }).then((res) => {
                assert(res.name === "This Contract Exists!");
                done();
            });
        });
    });
});
