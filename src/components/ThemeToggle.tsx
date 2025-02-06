
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasDarkClass = document.documentElement.getAttribute('data-theme') === 'dark';
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return hasDarkClass || prefersDark;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if ((isDark && currentTheme !== 'dark') || (!isDark && currentTheme !== 'light')) {
      setIsDark(currentTheme === 'dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle">
      <Sun className="theme-icon" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="theme-icon" />
    </div>
  );
}
