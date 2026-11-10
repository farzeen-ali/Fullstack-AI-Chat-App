/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        chat: {
          light: {
            bg: '#f8fafc',
            surface: '#ffffff',
            bubbleUser: '#2563eb',
            bubbleAi: '#e2e8f0',
            text: '#0f172a',
            muted: '#64748b',
            border: '#e2e8f0',
            accent: '#7c3aed',
          },
          dark: {
            bg: '#0b0f19',
            surface: '#151b2b',
            bubbleUser: '#3b82f6',
            bubbleAi: '#1e293b',
            text: '#f1f5f9',
            muted: '#94a3b8',
            border: '#334155',
            accent: '#a78bfa',
          },
        },
      },
    },
  },
  plugins: [],
};
