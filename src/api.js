import { getToken } from "./auth";

const API_BASE = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, { method = "GET", body, auth = false } = {}) {
  const isFormData = body instanceof FormData || (body && typeof body.append === 'function') || (body && body.toString() === '[object FormData]');
  console.log("API request:", path, "isFormData:", isFormData, "body:", body);
  const headers = isFormData ? {} : { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body == null ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("failed to fetch") || err.name === "TypeError") {
      throw new Error("failed to fetch");
    }
    throw err;
  }


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
  return request("/api/employeeupdation/employee/classes", { method: "GET", auth: true });
}

export function updateEmployeeClass(empId, newClass) {
  return request("/api/employeeupdation/employee-classes/update", {
    method: "POST",
    body: { empId, newClass },
    auth: true,
  });
}

export function getQuarterApplications() {
  return request("/api/admin/check-approval", { method: "GET", auth: true });
}

export function saveQuarterApplication(payload) {
  return request("/api/admin/checkapprovalsave", {
    method: "POST",
    body: payload,
    auth: true
  });
}
export function publishApplication(payload) {
  return request("/api/admin/publish", {
    method: "POST",
    body: payload,
    auth: true
  });
}
export function getLatestPublication() {
  return request("/api/admin/publication/latest", {
    method: "GET",
    auth: true,
  });
}
export function stopPublication() {
  return request("/api/admin/stop-publication", {
    method: "POST",
    auth: true,
  });
}
export function updatePublication(payload) {
  return request("/api/admin/publication/update", {
    method: "PUT",
    body: payload,
    auth: true,
  });
}

export function getHouseAllotmentCommitteeHistory() {
  return request("/api/admin/house-allotment-committee-history", {
    method: "GET",
    auth: true,
  });
}

export function saveHouseAllotmentCommitteeHistory(payload) {
  return request("/api/admin/house-allotment-committee-history", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function getDashboardStats() {
  return request("/api/estate-quarters/employees-by-type", {
    method: "GET",
    auth: true,
  });
}

export function getQuarterAreas() {
  return request("/api/estate-quarters/areas", {
    method: "GET",
    auth: true,
  });
}

export function getQuarterNumbers(areaType) {
  return request(`/api/estate-quarters/numbers?areaType=${encodeURIComponent(areaType)}`, {
    method: "GET",
    auth: true,
  });
}

export function updateQuarterStatus(payload) {
  return request("/api/estate-quarters/update-status", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function getQuarterTypes() {
  return request("/api/admin/quarter-types", {
    method: "GET",
    auth: true,
  });
}

export function generateCircular(payload) {
  return request("/api/admin/generate-circular", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function previewCircular(payload) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/admin/preview-circular`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate preview");
  }
  return await res.blob();
}

export { API_BASE, request };
