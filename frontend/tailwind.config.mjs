/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        green:  'var(--green)',
        dark:   'var(--dark)',
        offwhite: 'var(--offwhite)',
      },
      borderRadius: {
        card: '45px',
        badge: '7px',
        btn: '8px',
      },
      boxShadow: {
        card: '0px 5px 0px #191a23',
        'card-green': '0px 5px 0px #191a23',
      },
    },
  },
  plugins: [],
};
