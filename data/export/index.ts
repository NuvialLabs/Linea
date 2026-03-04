"use client";

import { BACKGROUND_COLOR, PRIMARY_COLOR } from "@/global/constants";
import { Timeline } from "@/global/types";
import XLSX from "xlsx-js-style";
import * as htmlToImage from "html-to-image";

export const exportJson = async (data: Timeline) => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

  download(blob, `${data.name}.json`);
};

export const exportExcel = async (data: Timeline) => {
  const formattedData = data.events.map((item) => ({
    id: item.id,
    name: item.name,
    initialDate: item.initialDate,
    endDate: item.endDate,
    color: item.color,
    link: item.link,
    description: item.description,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!worksheet[address]) continue;

    worksheet[address].s = {
      fill: {
        fgColor: { rgb: PRIMARY_COLOR.replaceAll("#", "") },
      },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center" },
    };
  }

  worksheet["!cols"] = [
    { wch: 10 },
    { wch: 20 },
    { wch: 11 },
    { wch: 11 },
    { wch: 9.5 },
    { wch: 45 },
    { wch: 45 },
  ];

  for (let R = range.s.r; R <= range.e.r; ++R) {
    ["F", "G"].forEach((col) => {
      const cellRef = col + (R + 1);
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = worksheet[cellRef].s || {};
        worksheet[cellRef].s.alignment = { wrapText: true, vertical: "top" };
      }
    });
  }

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Timeline");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  download(blob, `${data.name}.xlsx`);
};

export const exportImage = async (
  ref: React.RefObject<HTMLDivElement | null>,
  fileName: string,
) => {
  if (!ref.current) return;

  const dataUrl = await htmlToImage.toPng(ref.current, {
    width: ref.current.scrollWidth,
    height: ref.current.scrollHeight,
    backgroundColor: BACKGROUND_COLOR,
    style: {
      overflow: "visible",
      width: `${ref.current.scrollWidth}px`,
    },
  });

  const blob = await fetch(dataUrl).then((r) => r.blob());

  download(blob, `${fileName}.png`);
};

const download = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
