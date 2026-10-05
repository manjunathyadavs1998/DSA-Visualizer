/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        // Recursion Lab theme tokens — RGB triplets live in src/index.css (:root = dark, html.light = light)
        ink: "rgb(var(--rl-ink) / <alpha-value>)",
        panel: "rgb(var(--rl-panel) / <alpha-value>)",
        panel2: "rgb(var(--rl-panel2) / <alpha-value>)",
        line: "rgb(var(--rl-line) / <alpha-value>)",
        line2: "rgb(var(--rl-line2) / <alpha-value>)",
        mid: "rgb(var(--rl-mid) / <alpha-value>)",
        t1: "rgb(var(--rl-t1) / <alpha-value>)",
        t2: "rgb(var(--rl-t2) / <alpha-value>)",
        t3: "rgb(var(--rl-t3) / <alpha-value>)",
        t4: "rgb(var(--rl-t4) / <alpha-value>)",
        t5: "rgb(var(--rl-t5) / <alpha-value>)",
        codedim: "rgb(var(--rl-codedim) / <alpha-value>)",
        comment: "rgb(var(--rl-comment) / <alpha-value>)",
        cy: "rgb(var(--rl-cy) / <alpha-value>)",
        cyt: "rgb(var(--rl-cyt) / <alpha-value>)",
        am: "rgb(var(--rl-am) / <alpha-value>)",
        amt: "rgb(var(--rl-amt) / <alpha-value>)",
        gr: "rgb(var(--rl-gr) / <alpha-value>)",
        grt: "rgb(var(--rl-grt) / <alpha-value>)",
        pu: "rgb(var(--rl-pu) / <alpha-value>)",
        pk: "rgb(var(--rl-pk) / <alpha-value>)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}