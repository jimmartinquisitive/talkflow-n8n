
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { themes, ThemeName } from "@/config/themes";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('seaQuest');
  const { toast } = useToast();

  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem('theme', themeName);
    setCurrentTheme(themeName);
  };

  const handleThemeChange = (themeName: ThemeName) => {
    applyTheme(themeName);
    toast({
      description: `Theme changed to ${themes[themeName].name}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([themeName, theme]) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => handleThemeChange(themeName as ThemeName)}
            className="cursor-pointer"
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
