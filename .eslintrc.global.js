module.exports = {
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  globals: {
    window: true,
    document: true
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'key-spacing' : ['error', {
      align: 'colon',
      beforeColon: true,
      afterColon: true
    }
    ],
    'max-len' : ['error', {
      code: 100,
      tabWidth: 4,
      ignoreUrls: true
    }],
    'prefer-spread': ['off', {}],
    'mocha/no-exclusive-tests': 'error'
  },
  plugins: [
    'mocha'
  ]
};
