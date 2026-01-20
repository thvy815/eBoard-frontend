export function ymRange(startDate: string, endDate: string) {
  const s = startDate?.slice(0, 7) ?? "";
  const e = endDate?.slice(0, 7) ?? "";
  return s && e ? `${s} - ${e}` : "-";
}

export function normDateAny(d: any) {
  if (!d) return "";
  const s = String(d);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m?.[1]) return m[1];
  const dt = new Date(s);
  if (isNaN(dt.getTime())) return s;
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isoToVN(iso?: string) {
  if (!iso) return "-";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function isISODate(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}
