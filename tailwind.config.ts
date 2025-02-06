
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				seaQuest: {
					'50': '#e6cce5',
					'100': '#d0b3da',
					'200': '#9588c2',
					'300': '#6778aa',
					'400': '#4f7a94',
					'500': '#407880',
					'600': '#386d6d',
					'700': '#335c5b',
					'800': '#304c4d',
					'900': '#2d3b3e',
				},
				dark: {
					a0: "#2d3b3e",
				},
				light: {
					a0: "#e6cce5",
				},
				primary: {
					a0: "#d0b3da",
					a10: "#9588c2",
					a20: "#6778aa",
					a30: "#4f7a94",
					a40: "#407880",
					a50: "#386d6d",
				},
				surface: {
					a0: "#2d3b3e",
					a10: "#304c4d",
					a20: "#335c5b",
					a30: "#386d6d",
					a40: "#407880",
					a50: "#4f7a94",
				},
				"surface-tonal": {
					a0: "#304c4d",
					a10: "#335c5b",
					a20: "#386d6d",
					a30: "#407880",
					a40: "#4f7a94",
					a50: "#6778aa",
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
