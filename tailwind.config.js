export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0B0F14', // Near black
        'brand-teal': '#2FBF9F',
        'brand-green': '#7ED957',
        'brand-text': '#F3E9D2', // Warm off-white
        
        // Semantic adjustments for the gradient
        'brand-card': 'rgba(243, 233, 210, 0.03)',
        'brand-card-hover': 'rgba(243, 233, 210, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
