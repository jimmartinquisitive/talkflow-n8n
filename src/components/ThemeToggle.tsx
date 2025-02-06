import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Initialize with system preference or existing class
    if (typeof window !== 'undefined') {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return hasDarkClass || prefersDark;
    }
    return true; // Default to dark mode
  });

  useEffect(() => {
    // Set initial theme class
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    // Sync the UI with the actual theme state
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDark !== isDarkMode) {
      setIsDark(isDarkMode);
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}