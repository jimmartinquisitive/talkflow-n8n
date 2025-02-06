
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
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Apply default theme if no saved theme
      applyTheme('seaQuest');
    }
  }, []);

  const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem('theme', themeName);
    setCurrentTheme(themeName);
  };

  const handleThemeChange = (themeName: ThemeName) => {
    if (themeName === currentTheme) return;
    
    applyTheme(themeName);
    toast({
      description: `Theme changed to ${themes[themeName].name}`,
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {Object.entries(themes).map(([themeName, theme]) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => handleThemeChange(themeName as ThemeName)}
            className={`cursor-pointer ${
              currentTheme === themeName ? 'bg-accent' : ''
            }`}
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
