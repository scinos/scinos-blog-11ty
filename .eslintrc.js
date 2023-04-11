module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    extends: [
        'eslint:recommended',
        'airbnb',
        'plugin:react/jsx-runtime',
        'plugin:md/prettier',
        'plugin:prettier/recommended',
    ],
    settings: {
        'import/resolver': {
            'enhanced-resolve': {},
        },
    },
    overrides: [
        {
            files: ['*.md'],
            parser: 'markdown-eslint-parser',
            rules: {
                'prettier/prettier': [
                    'error',
                    {
                        parser: 'markdown',
                        proseWrap: 'always',
                        printWidth: 120,
                        tabWidth: 2,
                    },
                ],
                'md/remark': [
                    'error',
                    {
                        // This object corresponds to object you would export in .remarkrc file
                        plugins: [
                            'preset-lint-markdown-style-guide',
                            'frontmatter',
                            ['lint-maximum-line-length', 120],
                            ['lint-emphasis-marker', false],
                            ['lint-list-item-indent', 'space'],
                        ],
                    },
                ],
            },
        },
        {
            files: ['*.jsx'],
        },
        {
            files: ['*.md.js'],
            rules: {
                'no-unused-vars': 'off',
                'no-console': 'off',
            },
        },
    ],
    rules: {
        indent: ['error', 4],
        'no-plusplus': 'off',
        'no-cond-assign': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: true },
        ],
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'react/prop-types': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-array-index-key': 'off',
    },
};
