export const ADMIN_LOGIN_STORAGE_KEY = "reserve-admin-session";

export const ADMIN_LOGIN_ENV = (import.meta.env.VITE_ADMIN_LOGIN as string | undefined)?.trim() || "admin";
export const ADMIN_PASSWORD_ENV = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "admin";

export type StoredAdminSession = {
  isAuthenticated: true;
  login: string;
};

export function readStoredAdminSession(): StoredAdminSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(ADMIN_LOGIN_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredAdminSession>;

    if (parsed.isAuthenticated === true && typeof parsed.login === "string" && parsed.login.length > 0) {
      return { isAuthenticated: true, login: parsed.login };
    }
  } catch {
    window.localStorage.removeItem(ADMIN_LOGIN_STORAGE_KEY);
  }

  return null;
}

export function persistAdminSession(login: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ADMIN_LOGIN_STORAGE_KEY,
    JSON.stringify({
      isAuthenticated: true,
      login,
    } satisfies StoredAdminSession),
  );
}

export function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_LOGIN_STORAGE_KEY);
}

export function validateAdminCredentials(login: string, password: string) {
  return login === ADMIN_LOGIN_ENV && password === ADMIN_PASSWORD_ENV;
}
