/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          pink: "#FF3366",
          purple: "#7A14DE",
          dark: "#0F1117",
          card: "#1E2230",
          accent: "#FF4D80",
          pass: "#FF4458",
          like: "#00E096",
          superlike: "#3B82F6",
        },
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
