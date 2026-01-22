import type { ClassItem } from "@/types/Class";
import { normDateAny } from "@/utils/date";

export function mapToClassItem(x: any): ClassItem {
  // ✅ API mới trả về grade: "Khối lớp 5"
  const gradeLabel =
    x?.grade ??
    x?.gradeLabel ??
    x?.gradeName ??
    x?.grade?.name ??
    "-";

  return {
    id: String(x?.id ?? ""),
    name: x?.name ?? "-",
    gradeLabel,
    roomName: x?.roomName ?? "-",
    startDate: normDateAny(x?.startDate),
    endDate: normDateAny(x?.endDate),
    currentStudentCount: Number(x?.currentStudentCount ?? 0),
    maxCapacity: Number(x?.maxCapacity ?? 0),
    classDescription: x?.description ?? x?.classDescription ?? "",
  };
}
