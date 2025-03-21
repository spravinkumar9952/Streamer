/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main theme colors
        primary: {
          DEFAULT: "#4A4458", // Main purple
          light: "#6B6580",
          dark: "#2D2938",
        },
        secondary: {
          DEFAULT: "#7D5260", // Accent color
          light: "#9B6B7A",
          dark: "#5C3A45",
        },
        // Background colors
        background: {
          primary: "#4A4458",
          secondary: "#2D2938",
          tertiary: "#1A1722",
          card: "#3A3548",
        },
        // Text colors
        text: {
          primary: "#FFFFFF",
          secondary: "#E0E0E0",
          tertiary: "#B0B0B0",
          accent: "#7D5260",
        },
        // Status colors
        status: {
          online: "#4CAF50",
          offline: "#9E9E9E",
          error: "#F44336",
          success: "#4CAF50",
          warning: "#FFC107",
        },
        // Border colors
        border: {
          light: "#5C5C5C",
          DEFAULT: "#4A4458",
          dark: "#2D2938",
        },
        // Input colors
        input: {
          background: "#3A3548",
          border: "#5C5C5C",
          focus: "#7D5260",
        },
        // Button colors
        button: {
          primary: {
            background: "#7D5260",
            hover: "#9B6B7A",
            text: "#FFFFFF",
          },
          secondary: {
            background: "#3A3548",
            hover: "#4A4458",
            text: "#FFFFFF",
          },
        },
      },
      fontFamily: {
        primaryFont: ['HermeneusOne'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        'navbar': '4rem',
        'sidebar': '16rem',
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

