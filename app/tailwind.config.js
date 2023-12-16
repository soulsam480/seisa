import defaultTheme from 'tailwindcss/defaultTheme'

const UI_BORDER_COLORS = {
  'base': 'var(--el-border-color)',
  'light': 'var(--el-border-color-light)',
  'lighter': 'var(--el-border-color-lighter)',
  'dark': 'var(--el-border-color-dark)',
  'darker': 'var(--el-border-color-darker)',
  'extra-light': 'var(--el-border-color-extra-light)',
}

const UI_BORDER_RADIUS = {
  base: 'var(--el-border-radius-base)',
  small: 'var(--el-border-radius-small)',
  round: 'var(--el-border-radius-round)',
  circle: 'var(--el-border-radius-circle)',
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{vue,ts}'],
  theme: {
    extend: {
      borderColor: {
        ...defaultTheme.borderColor,
        ...UI_BORDER_COLORS,
      },
      borderRadius: {
        ...defaultTheme.borderRadius,
        ...UI_BORDER_RADIUS,
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,var(--el-color-white))',
        },
      })
    },
  ],
}
