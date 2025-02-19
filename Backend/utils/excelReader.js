const xlsx = require("xlsx");

const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath); // Read the Excel file
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const sheet = workbook.Sheets[sheetName]; // Access the sheet
  const data = xlsx.utils.sheet_to_json(sheet); // Convert to JSON

  return data; 
};

module.exports = readExcelFile;
