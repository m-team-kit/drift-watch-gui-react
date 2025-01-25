import eslint from '@eslint/js';
import tseslint, { type ConfigWithExtends } from 'typescript-eslint';
// @ts-expect-error untyped package
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';

import reactPlugin from 'eslint-plugin-react';

import path from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const name = (alias: string) => (config: ConfigWithExtends) => {
  config['name'] ??= `(${alias})`;
  return config;
};

const config = tseslint.config(
  {
    ignores: ['src/api/*', 'src/routeTree.gen.ts', 'dist/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    name: '(typescript config)',
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  jsxA11y.flatConfigs.strict,

  ...compat.plugins('import').map(name('plugin:import')),

  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  ...compat.extends('plugin:react-hooks/recommended').map(name('react-hooks/recommended')),

  {
    rules: {
      'react/no-unknown-property': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'react/jsx-no-target-blank': 'off',
    },
  },

  ...compat.plugins('github').map(name('plugin:github')),

  // must come after github as github seemingly enables awful prettier plugin
  name('prettier')(prettier as ConfigWithExtends),

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  name('comments/recommended')(comments.recommended as ConfigWithExtends),

  ...compat.plugins('prefer-arrow-functions').map(name('plugin:prefer-arrow-functions')),

  {
    name: '(furality overrides)',
    rules: {
      // prefer @ts-expect-error over @ts-ignore
      '@typescript-eslint/ban-ts-comment': 'warn',

      // enforce curly braces for style and readability
      curly: 'error',

      // avoid logging junk to user browser
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      // minor formatting check, good canary to tell if formatter is off
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],

      // autofix, use templates instead of concatenation (n.b. can be painful with nesting)
      'prefer-template': 'warn',

      // autofix, forbid ={"foo"} and <xyz>{"foo"}</xyz>
      'react/jsx-curly-brace-presence': [
        'warn',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],

      // autofix, omit ={true} for boolean flags, omission is implicit false
      'react/jsx-boolean-value': [
        'warn',
        'never',
        {
          assumeUndefinedIsFalse: true,
        },
      ],

      // autofix, omit <></> for single children
      'react/jsx-no-useless-fragment': 'warn',

      // autofix, require <> over <Fragment> unless keys are provided
      'react/jsx-fragments': 'warn',

      // require === over ==
      eqeqeq: ['warn', 'smart'],

      // prefer else if () over else { if () }
      'no-lonely-if': 'warn',

      // only 1 declaration per line
      'one-var-declaration-per-line': 'warn',
      // only 1 assignment per statement
      'no-multi-assign': 'warn',

      // no scope shadowing
      '@typescript-eslint/no-shadow': 'warn',

      // autofix, no unnecessary empty returns
      'no-useless-return': 'warn',

      // autofix, no import { xy as xy } or let { x: x }
      'no-useless-rename': 'warn',

      // use spreads instead of object.assign
      'prefer-object-spread': 'warn',

      // warn about loop iterations that are always skipped
      'no-unreachable-loop': 'warn',

      // warn about ${} being used in "" or '' strings
      'no-template-curly-in-string': 'warn',

      // require default: be at end of switch case
      'default-case-last': 'warn',

      // init arrays with [1, 2, 3] instead of new Array(1, 2, 3)
      'no-array-constructor': 'warn',

      // nitpick: forbid else { return } after if { return }
      'no-else-return': 'warn',

      // warn about forgotten returns in array methods
      'array-callback-return': 'warn',

      // prefer type over interface
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

      // check if useful
      //"no-secrets/no-secrets": "warn",

      // autofix, require all imports come before other code
      'import/first': 'error',
      // autofix, no absolute paths
      'import/no-absolute-path': 'error',
      // disallow multiple import statements from same file
      'import/no-duplicates': 'error',

      // require import type if importing types
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          // require type imports
          prefer: 'type-imports',
          // format as { type X } instead of type { X }
          fixStyle: 'inline-type-imports',
        },
      ],
      // require { type X } over import type { X } for groupability
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],

      // prefer () => {} over function() {}
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],

      // vs plugin:@typescript-eslint/strict-type-checked
      // used to silence promise warnings, e.g. useEffect etc
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-floating-promises': 'off', // used on for event handlers
      '@typescript-eslint/no-misused-promises': 'off', // used on for event handlers

      // conflicts with api clients
      '@typescript-eslint/unbound-method': 'off',

      // bad for i18next
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/anchor-has-content': 'off',

      '@typescript-eslint/restrict-template-expressions': [
        'warn',
        {
          allowNumber: true,
        },
      ],
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },
);

export default config;
