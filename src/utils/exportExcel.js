import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, columns, fileName = "Export") => {
  if (!data || data.length === 0) return;

  const exportData = data.map((row, index) => {
    const obj = {};

    columns.forEach((col) => {
      if (col.key === "sr") {
        obj[col.label] = index + 1;
      } else {
        obj[col.label] = row[col.key] ?? "-";
      }
    });

    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `${fileName}.xlsx`);
};