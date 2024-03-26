var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Contract from "./models/Contracts";
import "dotenv/config";
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
