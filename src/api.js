import { getToken } from "./auth";

const API_BASE = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function login(username, password) {
  return request("/api/auth/login", { method: "POST", body: { username, password } });
}

export function registerEmployee(payload) {
  return request("/api/auth/register-employee", { method: "POST", body: payload });
}

export function lookupEmployee(employeeId, dateOfBirth) {
  return request("/api/employee/lookup", { method: "POST", body: { employeeId, dateOfBirth } });
}

export function getEmployeeClasses() {
  return request("/api/employee/classes");
}
export function getQuarterApplications() {
  return request("/api/auth/quarter-applications", { auth: true });
}
export { API_BASE, request };
