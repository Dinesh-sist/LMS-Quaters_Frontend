const TOKEN_KEY = "lmsq_token";
const USER_KEY = "lmsq_user";
const SESSION_TOKEN_KEY = "lmsq_session_token";
const SESSION_USER_KEY = "lmsq_session_user";
const AUTH_RECOVERY_KEY = "lmsq_auth_recovery";

function normalizeUser(user) {
  if (!user || typeof user !== "object") return null;

  return {
    ...user,
    role: typeof user.role === "string" ? user.role.toLowerCase() : user.role,
  };
}

export function setAuth({ token, user }) {
  const normalizedUser = normalizeUser(user);
  const safeToken = token || "";

  localStorage.setItem(TOKEN_KEY, safeToken);
  sessionStorage.setItem(SESSION_TOKEN_KEY, safeToken);

  if (normalizedUser) {
    const serializedUser = JSON.stringify(normalizedUser);
    localStorage.setItem(USER_KEY, serializedUser);
    sessionStorage.setItem(SESSION_USER_KEY, serializedUser);
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(SESSION_TOKEN_KEY) || "";
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(SESSION_USER_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function isAuthed() {
  return Boolean(getToken());
}

export function stashAuthRecovery(payload = {}) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return;

  sessionStorage.setItem(
    AUTH_RECOVERY_KEY,
    JSON.stringify({
      token,
      user,
      ...payload,
    })
  );
}

export function consumeAuthRecovery() {
  const raw = sessionStorage.getItem(AUTH_RECOVERY_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(AUTH_RECOVERY_KEY);

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

