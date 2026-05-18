import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  ADMIN_LOGIN_ENV,
  ADMIN_PASSWORD_ENV,
  clearAdminSession,
  persistAdminSession,
  readStoredAdminSession,
  validateAdminCredentials,
} from "./model/session";

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  loginName: string | null;
  hasDefaultCredentials: boolean;
  signIn: (login: string, password: string) => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialAuthState() {
  const storedSession = readStoredAdminSession();

  return {
    isAuthenticated: Boolean(storedSession),
    loginName: storedSession?.login ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialAuthState] = useState(getInitialAuthState);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated);
  const [loginName, setLoginName] = useState<string | null>(initialAuthState.loginName);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isReady: true,
      loginName,
      hasDefaultCredentials: ADMIN_LOGIN_ENV === "admin" && ADMIN_PASSWORD_ENV === "admin",
      signIn: (login, password) => {
        const trimmedLogin = login.trim();
        const isValid = validateAdminCredentials(trimmedLogin, password);

        if (!isValid) {
          return false;
        }

        persistAdminSession(trimmedLogin);
        setIsAuthenticated(true);
        setLoginName(trimmedLogin);

        return true;
      },
      signOut: () => {
        clearAdminSession();
        setIsAuthenticated(false);
        setLoginName(null);
      },
    }),
    [isAuthenticated, loginName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
