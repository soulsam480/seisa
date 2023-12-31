import defaultTheme from 'tailwindcss/defaultTheme'
import typo from '@tailwindcss/typography'

const ELEMENT_COLORS = ['primary', 'success', 'warning', 'danger', 'error', 'info']

const ELEMENT_SHADES = [
  'light-3',
  'light-5',
  'light-7',
  'light-8',
  'light-9',
  'dark-2',
]

const ELEMENT_COLOR_VARIABLES = ELEMENT_COLORS.reduce((acc, color) => {
  const colorBase = `el-${color}`

  acc = {
    ...acc,
    [colorBase]: `var(--el-color-${color})`,
    ...ELEMENT_SHADES.reduce((acc, shade) => {
      acc[`${colorBase}-${shade}`] = `var(--el-color-${color}-${shade})`
      return acc
    }, {}),
  }

  return acc
}, {})

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
  content: ['./src/**/*.{vue,ts}'],
  theme: {
    extend: {
      textColor: {
        ...defaultTheme.textColor,
        ...ELEMENT_COLOR_VARIABLES,
      },
      backgroundColor: {
        ...defaultTheme.backgroundColor,
        ...ELEMENT_COLOR_VARIABLES,
      },
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
    typo,
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,var(--el-color-white))',
        },
      })
    },
  ],
}
