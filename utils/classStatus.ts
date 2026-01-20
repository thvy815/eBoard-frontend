import type { ClassItem } from "@/types/Class";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// endDate < today => past
export function isPastClass(c: ClassItem) {
  const end = (c.endDate || "").slice(0, 10);
  if (!end) return false;
  return end < todayISO();
}

export function isCurrentClass(c: ClassItem) {
  return !isPastClass(c);
}
