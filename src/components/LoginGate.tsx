import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const CORRECT_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY;

interface LoginGateProps {
  children: React.ReactNode;
}

export const LoginGate = ({ children }: LoginGateProps) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, password);
      setIsAuthenticated(true);
      toast.success("Successfully logged in");
    } else {
      toast.error(t("auth.invalidPassword"));
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="animate-pulse text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-4 flex items-center">
            <img src={logo} alt="Duvenbeck" className="h-12" />
            <div className="text-center">
              <CardTitle className="text-2xl">{t("app.title")}</CardTitle>
              <CardDescription>{t("app.subtitle")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                {t("auth.login")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
