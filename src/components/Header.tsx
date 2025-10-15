import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Calculator,
  Languages,
  LogOut,
  Menu,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem("duvenbeck-auth");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <img src={logo} alt="Duvenbeck" className="h-8" />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-foreground">
              {t("app.title")}
            </h1>
            <p className="text-xs text-muted-foreground">{t("app.subtitle")}</p>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/priority-analysis">
              <Button
                variant={
                  location.pathname === "/priority-analysis"
                    ? "default"
                    : "ghost"
                }
                size="sm"
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                Priority Analysis
              </Button>
            </Link>
            <Link to="/chat">
              <Button
                variant={location.pathname === "/chat" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {t("nav.chat")}
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Navigation Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover w-48">
              <Link to="/">
                <DropdownMenuItem className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link to="/priority-analysis">
                <DropdownMenuItem className="gap-2">
                  <Calculator className="h-4 w-4" />
                  Priority Analysis
                </DropdownMenuItem>
              </Link>
              <Link to="/chat">
                <DropdownMenuItem className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {t("nav.chat")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => changeLanguage("de")}>
                Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
