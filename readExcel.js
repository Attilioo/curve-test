import xlsx from "xlsx";
export const readExcelFile = (path) => {
    try {
        const workbook = xlsx.readFile(path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        return jsonData;
    }
    catch (error) {
        if (error.code === "ENOENT") {
            return "This path is incorrect or does not exist!";
        }
        else {
            throw error; // Rethrow any other errors
        }
    }
};
