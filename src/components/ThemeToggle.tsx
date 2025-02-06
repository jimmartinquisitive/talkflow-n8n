
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains("dark");
    }
    return true; // Default to dark mode
  });

  useEffect(() => {
    // Set initial theme class
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <div className="flex items-center gap-2 text-light-a0">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
        className="data-[state=checked]:bg-primary-a0"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}
