import mongoose from "mongoose";
import Track from "./models/Tracks.js";
import Contract from "./models/Contracts.js";
import "dotenv/config";
import { assert, expect } from "chai";

before(async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the .env file");
  }
  await mongoose.connect(process.env.MONGODB_URL);
}); //In a scenario outside of the test I would make sure that the DB used was a test one, of course I would not delete everything off the database.
//for the sake of the test I do delete all the data from the DB.
after(async () => {
  await Track.deleteMany({});
  await Contract.deleteMany({});
  console.log("Track & Contract collection cleared");
});

describe("Database Connection", () => {
  it("should connect to the database successfully", (done) => {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in the .env file");
    }
    mongoose.connect(process.env.MONGODB_URL).then(() => {
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
        assert(res!.name === "This Contract Exists!");
        done();
      });
    });
  });
});
