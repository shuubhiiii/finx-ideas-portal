/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1020",
          soft: "#1A1F33",
          muted: "#5B6478",
        },
        royal: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        silver: {
          50:  "#FAFBFC",
          100: "#F4F6F9",
          200: "#E8ECF2",
          300: "#D6DCE6",
          400: "#B7C0CE",
        },
        // Pastel accent system
        mint:     { 50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 500: "#10B981", 700: "#047857" },
        peach:    { 50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 500: "#F97316", 700: "#C2410C" },
        lavender: { 50: "#F5F3FF", 100: "#EDE9FE", 200: "#DDD6FE", 500: "#8B5CF6", 700: "#6D28D9" },
        sky:      { 50: "#F0F9FF", 100: "#E0F2FE", 200: "#BAE6FD", 500: "#0EA5E9", 700: "#0369A1" },
        butter:   { 50: "#FEFCE8", 100: "#FEF9C3", 200: "#FEF08A", 500: "#EAB308", 700: "#A16207" },
        blush:    { 50: "#FFF1F2", 100: "#FFE4E6", 200: "#FECDD3", 500: "#F43F5E", 700: "#BE123C" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)",
        card: "0 4px 24px -8px rgba(16,24,40,.10), 0 2px 6px -2px rgba(16,24,40,.05)",
        ring: "0 0 0 1px rgba(99,102,241,.18), 0 12px 40px -16px rgba(67,56,202,.35)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18), transparent 60%)",
        "warm-fade":
          "radial-gradient(ellipse 60% 40% at 90% 10%, rgba(244,114,182,0.10), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
        fadeUp: "fadeUp .5s ease-out both",
      },
    },
  },
  plugins: [],
};
