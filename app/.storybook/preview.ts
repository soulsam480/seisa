import type { Preview } from '@storybook/vue3'
import '../src/style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

document.documentElement.classList.add('dark')

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
    },
  },
}

export default preview
