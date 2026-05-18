import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, FieldError, Input, Label } from "@/shared/ui/Form";

type LoginLocationState = {
  redirectTo?: string;
};

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, hasDefaultCredentials, signIn } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTo = (location.state as LoginLocationState | null)?.redirectTo || "/admin";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = signIn(login, password);

    if (!success) {
      setErrorMessage("Неверный логин или пароль.");
      return;
    }

    setErrorMessage("");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-md place-items-center">
      <Card className="w-full p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-700 text-white shadow-lg shadow-sage-700/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sage-700">Admin Access</p>
            <h1 className="mt-2 text-2xl font-semibold text-graphite-900">Вход в админ-панель</h1>
            <p className="mt-2 text-sm leading-6 text-graphite-500">
              После успешного входа доступ сохранится в этом браузере, и повторно вводить логин и пароль не
              потребуется.
            </p>
          </div>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="admin-login">Логин</Label>
            <Input
              id="admin-login"
              name="login"
              autoComplete="username"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Введите логин"
            />
          </Field>

          <Field>
            <Label htmlFor="admin-password">Пароль</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
            />
            <FieldError>{errorMessage}</FieldError>
          </Field>

          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>

        {hasDefaultCredentials && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Используются стандартные данные `admin` / `admin`. Для production задайте `VITE_ADMIN_LOGIN` и
            `VITE_ADMIN_PASSWORD` в `.env`.
          </div>
        )}
      </Card>
    </div>
  );
}
