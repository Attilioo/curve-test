import mongoose from "mongoose";
import Contract from "./models/Contracts.js";
import Track from "./models/Tracks.js";
import "dotenv/config";
import { assert } from "chai";
import { readExcelFile } from "./readExcel.js";
import { describe } from "node:test";
import { ingestData } from "./index.js";

before(async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the .env file");
  }
  await mongoose.connect(process.env.MONGODB_URL);
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

describe("readExcelFile", () => {
  it("Should receive an array of objects with the Json data from an excel file", async () => {
    interface ExcelData {
      ID?: string;
      ISRC?: string;
      Aliases?: string;
      Contract?: string;
      Title?: string;
      Version?: string;
      Artist?: string;
      "P Line"?: string;
    }
    const jsonData: ExcelData[] = (await readExcelFile(
      `./details/Track Import Test.xlsx`
    )) as ExcelData[];
    assert(typeof jsonData === "object");
    assert(jsonData[1].Title === "Track 1");
    assert(jsonData[1].Version === "Version 1");
  });
  it("Should return a string when the path is not an existing one", async () => {
    const jsonData = await readExcelFile("not a valid path");
    assert(jsonData === "This path is incorrect or does not exist!");
  });
});

describe("Track", () => {
  it("should fail to create a track with missing required fields", (done) => {
    const track = new Track({
      title: "Test Title",
      // missing version, artist, and other required fields
    });
    track.save().catch((err) => {
      assert(err._message === "Track validation failed");
      done();
    });
  });
  it("should return a confirmation message when all tracks are digested without errors", async () => {
    {
      const fakeCorrectData = [
        {
          Title: "Track 3",
          Version: "Version 3",
          Artist: "Artist 3",
          ISRC: "ISRC2",
          "P Line": "P Line 2",
          Aliases: "aliases11 ; aliases22",
          Contract: "Contract 1",
        },
      ];
      const response = await ingestData(fakeCorrectData);
      assert(response === "All tracks ingested successfully.");
    }
  });

  it("should return a confirmation message when tracks without contract are digested", (done) => {
    {
      const fakeDatawithNullContract = [
        {
          Title: "Track 3",
          Version: "Version 3",
          Artist: "Artist 3",
          ISRC: "ISRC2",
          "P Line": "P Line 2",
          Aliases: "aliases11 ; aliases22",
          Contract: null,
        },
      ];
      ingestData(fakeDatawithNullContract).then((res) => {
        assert(res === "All tracks ingested successfully.");
        done();
      });
    }
  });
});

//In a scenario outside of the test I would make sure that the DB used was a test one, of course I would not delete everything off the database.
//for the sake of this assignment, after all the tests I do delete all the data from the DB .


after(async () => {
  await Track.deleteMany({});
  await Contract.deleteMany({});
  console.log("Track & Contract collection cleared");
});
