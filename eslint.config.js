// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['api/scripts/*', 'api/src/migrations/index.ts'],

  typescript: true,
  vue: true,

  formatters: {
    css: 'prettier',
  },
})
