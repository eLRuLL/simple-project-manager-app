/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0055B3',
          light: '#4DA3FF',
        },
        secondary: {
          DEFAULT: '#5856D6',
          dark: '#3634A3',
          light: '#7A79E0',
        },
        success: {
          DEFAULT: '#34C759',
          dark: '#248A3D',
          light: '#5CD679',
        },
        error: {
          DEFAULT: '#FF3B30',
          dark: '#D70015',
          light: '#FF6961',
        },
        warning: {
          DEFAULT: '#FF9500',
          dark: '#CC7700',
          light: '#FFAA33',
        },
        backlog: {
          DEFAULT: '#A0AEC0',
        },
        todo: {
          DEFAULT: '#4299E1',
        },
        inProgress: {
          DEFAULT: '#ED8936',
        },
        completed: {
          DEFAULT: '#48BB78',
        },
        dark: {
          DEFAULT: '#1A202C',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}
