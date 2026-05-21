/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        slateui: '#5A6478',
        line: '#D9DEE8',
        cloud: '#F6F8FB',
        brand: '#2358D8',
        teal: '#0F8B8D',
        amber: '#B66A00',
        rose: '#C2415D',
      },
      boxShadow: {
        soft: '0 12px 35px rgba(23, 32, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
