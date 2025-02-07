import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			'instrument-serif': ['"Instrument Serif"', 'serif'],
			'playfair-display': ['"Playfair Display"', 'serif'],
			'clash-display': ['"Clash Display"', 'serif'],
			'futura-now-headline': ['"Futura Now"', 'sans-serif'],
      },
  		colors: { 
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			}, 
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		backgroundImage: {
            'grid-black': 'linear-gradient(to right, rgb(0 0 0 / 0.15) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgb(0 0 0 / 0.15) 1.5px, transparent 1.5px)',
		},
		backgroundSize: {
		    'grid': '40px 40px',
		},
		transitionTimingFunction: {
			'custom-ease': 'cubic-bezier(0.17, 0.55, 0.55, 1)',
		},
		animation: {
			stacking: 'stacking 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) forwards',
			marquee: 'marquee 40s linear infinite',
			marquee2: 'marquee2 40s linear infinite',
			'marquee-reverse': 'marquee-reverse 40s linear infinite',
			'marquee2-reverse': 'marquee2-reverse 40s linear infinite',
			'marquee-slow': 'marquee 60s linear infinite',
			'marquee-fast': 'marquee 20s linear infinite',
			'marquee2-slow': 'marquee2 60s linear infinite',
			'marquee2-fast': 'marquee2 20s linear infinite',
		},
		borderColor: {
			border: 'hsl(var(--border))',
		},
		keyframes: {
			stacking: {
				'0%': { 
					transform: 'translateY(100px)',
					opacity: '0' 
				},
				'100%': { 
					transform: 'translateY(0)',
					opacity: '1' 
				}
			},
			marquee: {
				'0%': { transform: 'translateX(0%)' },
				'100%': { transform: 'translateX(-100%)' },
			},
			marquee2: {
				'0%': { transform: 'translateX(100%)' },
				'100%': { transform: 'translateX(0%)' },
			},
			'marquee-reverse': {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(0%)' },
			},
			'marquee2-reverse': {
				'0%': { transform: 'translateX(0%)' },
				'100%': { transform: 'translateX(100%)' },
			},
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
