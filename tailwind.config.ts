/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",],
  theme: {
    extend: {
      screens: {
        'sm': '640px',    // ขนาดจอเล็ก
        'md': '768px',    // ขนาดจอกลาง
        'lg': '1024px',   // ขนาดจอใหญ่
        'xl': '1280px',   // ขนาดจอใหญ่พิเศษ
        '2xl': '1536px',  // ขนาดจอใหญ่มาก
      },
      colors: {
        'primary': '#FF5656',
        'blue': '#1C3B6C'
      },
      fontFamily: {
        thai: ["Athiti", 'serif']
      },
    },
    plugins: [],
  }
}
