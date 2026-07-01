const SESSION_TOKEN_KEY = "lmsq_session_token";
const SESSION_USER_KEY = "lmsq_session_user";
const AUTH_RECOVERY_KEY = "lmsq_auth_recovery";

function normalizeUser(user) {
  if (!user || typeof user !== "object") return null;

  return {
    ...user,
    role: typeof user.role === "string"
      ? user.role.toLowerCase()
      : user.role,
  };
}

// Save auth data (per tab only)
export function setAuth({ token, user }) {
  const safeToken = token || "";
  const normalizedUser = normalizeUser(user);

  sessionStorage.setItem(SESSION_TOKEN_KEY, safeToken);

  if (normalizedUser) {
    sessionStorage.setItem(
      SESSION_USER_KEY,
      JSON.stringify(normalizedUser)
    );
  }
}

// Clear current tab auth only
export function clearAuth() {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
  sessionStorage.removeItem(AUTH_RECOVERY_KEY);
}

// Get token
export function getToken() {
  return sessionStorage.getItem(SESSION_TOKEN_KEY) || "";
}

// Get user
export function getUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

// Check login
export function isAuthed() {
  const token = getToken();
  const user = getUser();

  return Boolean(token && user);
}

// Store temporary auth recovery info
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

// Consume recovery info
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