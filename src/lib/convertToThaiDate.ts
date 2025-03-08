export function convertToThaiDate(
  date: Date | string,
  format: "long" | "short" = "long",
): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "วันที่ไม่ถูกต้อง";
  }

  const thaiYear = date.getFullYear() + 543;

  if (format === "short") {
    return `${date.getDate()}/${date.getMonth() + 1}/${thaiYear}`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Bangkok",
    };
    const thaiDate = date.toLocaleDateString("th-TH", options);
    return thaiDate.replace(
      new RegExp(date.getFullYear().toString(), "g"),
      thaiYear.toString(),
    );
  }
}
