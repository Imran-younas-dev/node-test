module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            classes: true,
            experimentalObjectRestSpread: true,
        },
    },
    extends: [
        'google',
        'prettier',
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:lodash/recommended',
        'plugin:promise/recommended',
        'plugin:prettier/recommended',
        'plugin:cypress/recommended',
    ],
    plugins: ['babel', 'import', 'lodash', 'promise', 'prettier'],
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'no-var': 'error',
        'no-alert': 'error',
        'no-undef': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'valid-jsdoc': 'off',
        'require-jsdoc': 'off',
        'new-cap': 'off',
        'babel/new-cap': 'off',
        'babel/camelcase': [
            'error',
            {
                properties: 'never',
            },
        ],
        'babel/valid-typeof': 'error',
        'babel/no-invalid-this': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'babel/no-unused-expressions': 'error',
        'space-before-blocks': 'error',
        'arrow-spacing': 'error',
        'key-spacing': [
            'error',
            {
                afterColon: true,
                mode: 'minimum',
            },
        ],
        'brace-style': ['error', '1tbs'],
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true,
            },
        ],
        'comma-style': [
            'error',
            'last',
            {
                exceptions: {
                    VariableDeclaration: true,
                },
            },
        ],
        'computed-property-spacing': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'prefer-const': 'error',
        'promise/no-nesting': 'off',
        'import/first': 'error',
        'import/newline-after-import': 'off',
        'import/no-named-as-default': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
            },
        ],
        'lodash/import-scope': 'off',
        'lodash/preferred-alias': 'off',
        'lodash/prop-shorthand': 'off',
        'lodash/prefer-lodash-method': 'off',
        'lodash/chain-style': ['off', 'as-needed'],
        'lodash/chaining': ['off', 'as-needed'],
        'lodash/prefer-thru': 'off',
        'max-len': [
            'error',
            {
                code: 120,
                ignoreStrings: true,
                ignoreComments: true,
                ignoreTemplateLiterals: true,
            },
        ],
    },
    overrides: [
        {
            files: ['cypress/integration/*/*.spec.js'],
            rules: {
                'promise/always-return': 'off',
                'promise/catch-or-return': 'off',
            },
        },
    ],
}
