import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['.wxt/**', '.output/**'],
  tsx: true,
  vue: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'ts/no-namespace': 'off',
    'ts/strict-boolean-expressions': 'off',
    'unicorn/prefer-dom-node-text-content': 'off',
  },
})
