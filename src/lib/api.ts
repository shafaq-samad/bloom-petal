export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const api = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
