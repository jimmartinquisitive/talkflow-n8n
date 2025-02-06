
export const themes = {
  seaQuest: {
    name: 'SeaQuest',
    colors: {
      background: 'hsl(195 24% 21%)',
      foreground: 'hsl(0 0% 100%)',
      primary: 'hsl(300 38% 85%)',
      secondary: 'hsl(201 31% 44%)',
      muted: 'hsl(201 31% 44%)',
      accent: 'hsl(201 31% 44%)',
      border: 'hsl(201 31% 44%)',
      popover: 'hsl(195 24% 21%)',
      'popover-foreground': 'hsl(0 0% 100%)',
    }
  },
  seaQuestLight: {
    name: 'SeaQuest Light',
    colors: {
      background: 'hsl(301 38% 85%)',
      foreground: 'hsl(195 24% 21%)',
      primary: 'hsl(195 24% 21%)',
      secondary: 'hsl(201 31% 44%)',
      muted: 'hsl(201 31% 44%)',
      accent: 'hsl(201 31% 44%)',
      border: 'hsl(201 31% 44%)',
      popover: 'hsl(301 38% 85%)',
      'popover-foreground': 'hsl(195 24% 21%)',
    }
  },
  seaQuestDark: {
    name: 'SeaQuest Dark',
    colors: {
      background: 'hsl(195 24% 15%)',
      foreground: 'hsl(301 38% 85%)',
      primary: 'hsl(301 38% 85%)',
      secondary: 'hsl(201 31% 44%)',
      muted: 'hsl(201 31% 44%)',
      accent: 'hsl(201 31% 44%)',
      border: 'hsl(201 31% 44%)',
      popover: 'hsl(195 24% 15%)',
      'popover-foreground': 'hsl(301 38% 85%)',
    }
  }
};

export type ThemeName = keyof typeof themes;
