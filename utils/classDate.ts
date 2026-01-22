export function toFirstDayISO(month: string, year: string) {
  const m = String(month).padStart(2, "0");
  const y = String(year);
  return `${y}-${m}-01`;
}

export function isValidMonth(m: string) {
  const n = Number(m);
  return Number.isInteger(n) && n >= 1 && n <= 12;
}

export function isValidYear(y: string) {
  return /^\d{4}$/.test(y) && Number(y) >= 1900 && Number(y) <= 2100;
}

export function compareYYYYMM(aY: string, aM: string, bY: string, bM: string) {
  const a = Number(aY) * 100 + Number(aM);
  const b = Number(bY) * 100 + Number(bM);
  return a - b;
}
