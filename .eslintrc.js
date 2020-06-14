module.exports = {
    env: {
        node: true,
        browser: true,
        webextensions: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
        'prettier/vue',
    ],
}
