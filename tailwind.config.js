import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFDE00',  // Define yellow-400 chính là #FFDE00 (có thể thêm shades khác nếu cần, ví dụ 100: '#fffbeb', 200: '#fef3c7', v.v. từ docs Tailwind)
        },
      },
      fontFamily: {
        // Font chính cho UI, Labels, Buttons (Plus Jakarta Sans)
        sans: ['"Plus Jakarta Sans"', '"Microsoft JhengHei"', 'sans-serif'],
        // Font riêng cho nội dung Blog (Merriweather)
        serif: ['"Merriweather"', 'serif'],
      },
      // fontFamily: {
      //   // Đặt Plus Jakarta Sans làm mặc định cho cả trang
      //   sans: ['"Merriweather"', 'sans-serif'],
      //   // Giữ mono cho các con số kỹ thuật nếu cần
      //   mono: ['"Merriweather"', 'sans-serif'],
      // },
    },
  },
  plugins: [
    typography,
  ],
};
