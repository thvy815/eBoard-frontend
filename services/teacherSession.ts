// src/services/teacherSession.ts

const KEY = "teacherId";

function getStorage() {
  if (typeof window === "undefined") return null;
  // ưu tiên localStorage, nếu không có thì sessionStorage
  return window.localStorage.getItem(KEY) ? window.localStorage : window.sessionStorage;
}

export const teacherSession = {
  setTeacherId(id: string, remember: boolean) {
    if (typeof window === "undefined") return;
    const store = remember ? window.localStorage : window.sessionStorage;
    store.setItem(KEY, id);
  },

  getTeacherId(): string | null {
    const store = getStorage();
    if (!store) return null;
    return store.getItem(KEY);
  },
clear() {
    localStorage.removeItem("teacherId");
  },

  clear1() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEY);
    window.sessionStorage.removeItem(KEY);
  },
};
