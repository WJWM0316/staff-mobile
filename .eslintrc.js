// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': 'off',
    "no-mixed-spaces-and-tabs": [2, true],//禁止混用tab和空格
    "no-multi-str": "off",
    "no-multiple-empty-lines": ["off", { "max": 1, "maxEOF": 0 }],
    "no-new-func": "off",
    "no-new-object": "off",
    "no-new-require": "off",
    "no-tabs": "off",
    "no-unused-vars": ["warn", { "vars": "all", "args": "none", "ignoreRestSiblings": true }],
    "eol-last": "off",
    "no-useless-escape": "off",
    "no-unused-vars": "off",
    "no-extend-native": "off",
    "prefer-promise-reject-errors": "off"
  }
}
