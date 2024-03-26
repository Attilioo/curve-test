import mongoose from "mongoose";
import Tracks from "./models/Tracks";
import Contracts from "./models/Contracts";
import "dotenv/config";
import { assert } from "chai";

describe("Database Connection", () => {
  it("should connect to the database successfully", (done) => {
    const mongoDbUrl = process.env.MONGODB_URL;
    if (!mongoDbUrl) {
      throw new Error(
        "MONGODB_URL is not defined in the .env file"
      );
    }
    mongoose.connect(mongoDbUrl).then(() => {
      assert(mongoose.connection.readyState === 1);
      done();
    });
  });
});
