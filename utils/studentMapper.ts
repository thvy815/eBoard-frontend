import type { CreateStudentRequest, ImportedStudent, StudentRow } from "@/types/Student";

export const SELECTED_CLASS_ID_KEY = "selectedClassId";
export const SELECTED_CLASS_NAME_KEY = "selectedClassName";

export function formatDobISOToVN(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

export function payloadToImportedStudent(p: CreateStudentRequest, idx: number): ImportedStudent {
  const fullName = `${p.lastName} ${p.firstName}`.trim();

  return {
    id: `imp_${idx}`,
    fullName: fullName || "Không rõ",
    dob: formatDobISOToVN(p.dateOfBirth),

    province: p.province ?? "",
    district: (p as any).district ?? "", // nếu payload không có district thì giữ rỗng
    ward: p.ward ?? "",
    gender: p.gender ?? "",
    relationshipWithParent: p.relationshipWithParent ?? "",

    address: p.address || "-",

    parentId: "", // import preview chưa có parentId
    parentName: p.parentFullName || "-",
    email: "",
    phone: p.parentPhoneNumber || "-",
    password: "-",
  };
}

export function splitFullName(fullName: string) {
  const name = fullName.trim().replace(/\s+/g, " ");
  const parts = name.split(" ").filter(Boolean);
  const firstName = parts.pop() || "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
}

export function mapStudentFromList(s: any): StudentRow {
  const firstName = s?.firstName ?? "";
  const lastName = s?.lastName ?? "";
  const fullName = `${lastName} ${firstName}`.trim() || "Không rõ";

  return {
    id: s?.id ?? "",
    fullName,
    dob: formatDobISOToVN(s?.dateOfBirth),

    gender: s?.gender ?? "",
    relationshipWithParent: s?.relationshipWithParent ?? "",

    address: (s?.fullAddress ?? s?.address ?? "").trim() || "-",
    province: s?.province ?? "",
    district: s?.district ?? "",
    ward: s?.ward ?? "",

    parentId: s?.parent?.id ?? "", 
    parentName: (s?.parent?.fullName ?? "").trim() || "Không rõ",
    email: (s?.parent?.email ?? "").trim() || "-",
    phone: (s?.parent?.phoneNumber ?? "").trim() || "-",
    password: "-",
  };
}

export function mapStudentFromDetail(s: any): StudentRow {
  const addr = (s?.fullAddress ?? s?.address ?? "").trim() || "-";

  return {
    id: s?.id ?? "",
    fullName: `${s?.lastName ?? ""} ${s?.firstName ?? ""}`.trim() || "Không rõ",
    dob: s?.dateOfBirth ?? "", // ✅ giữ ISO để edit

    address: addr,
    province: s?.province ?? "",
    district: s?.district ?? "",
    ward: s?.ward ?? "",

    gender: s?.gender ?? "",
    relationshipWithParent: s?.relationshipWithParent ?? "",

    parentId: s?.parent?.id ?? "", // ✅ lấy parentId từ detail
    parentName: s?.parent?.fullName ?? "-",
    phone: s?.parent?.phoneNumber ?? "-",
    email: s?.parent?.email ?? "-",
    password: s?.parent?.password ?? "-", // nếu BE không trả thì "-"
  };
}
