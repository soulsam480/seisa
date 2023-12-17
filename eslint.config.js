// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['api/scripts/*', 'api/src/migrations/index.ts', '**/*.json', '**/*.config.js'],
  
  typescript: true,
  vue: true,

  formatters: {
    css: 'prettier',
  },
})
