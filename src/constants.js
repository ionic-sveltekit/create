/**
 * Constants used throughout the application
 */

// Default project options
export const DEFAULT_OPTIONS = {
  name: 'ionic-sveltekit-project',
  path: '.',
  types: 'typescript',
  eslint: true,
  prettier: true,
  playwright: false,
  vitest: false,
  ionicons: true,
  capacitor: false,
  framework: 'svelte-kit'
};

// CLI option descriptions
export const OPTION_DESCRIPTIONS = {
  name: 'Name of the directory for the project',
  path: 'Location to install, name is appended',
  types: 'Add type checking with TypeScript',
  prettier: 'Add Prettier for code formatting',
  eslint: 'Add ESLint for code linting',
  playwright: 'Add Playwright for browser testing',
  vitest: 'Add Vitest for unit testing',
  ionicons: 'Include Ionic icon library',
  capacitor: 'Install dependencies for Capacitor',
  verbose: 'Show detailed output for troubleshooting',
  defaults: 'Skip all prompts and use default values',
  config: 'Load options from a saved configuration'
};

// CLI prompt messages
export const PROMPT_MESSAGES = {
  projectName: 'Name for your new project:',
  typescriptChoice: 'Add type checking with TypeScript?',
  eslintChoice: 'Add ESLint for code linting?',
  prettierChoice: 'Add Prettier for code formatting?',
  playwrightChoice: 'Add Playwright for browser testing?',
  vitestChoice: 'Add Vitest for unit testing?',
  ioniconsChoice: 'Include Ionic icon library?',
  capacitorChoice: 'Add Capacitor for native (mobile) deployments?',
  saveConfig: 'Would you like to save this configuration for future use?',
  configName: 'Name for this configuration:'
};

// Package manager commands
export const PM_COMMANDS = {
  npm: {
    install: 'install',
    add: 'install',
    addDev: 'install --save-dev',
    run: 'run',
    global: 'install -g'
  },
  pnpm: {
    install: 'install',
    add: 'add',
    addDev: 'add -D',
    run: 'run',
    global: 'add -g'
  },
  yarn: {
    install: 'install',
    add: 'add',
    addDev: 'add -D',
    run: '',
    global: 'global add'
  }
};

// External resources
export const RESOURCES = {
  typescriptDocs: 'https://www.typescriptlang.org/tsconfig#checkJs',
  eslintDocs: 'https://sveltejs.github.io/eslint-plugin-svelte/',
  prettierDocs: 'https://prettier.io/docs/en/options.html',
  playwrightDocs: 'https://playwright.dev',
  vitestDocs: 'https://vitest.dev',
  capacitorDocs: 'https://capacitorjs.com/docs/getting-started',
  ionicDocs: 'https://ionic.io/ionicons',
  pwaDocs: 'https://github.com/vite-pwa/sveltekit',
  ionicDiscord: 'https://discordapp.com/channels/520266681499779082/1049388501629681675',
  githubRepo: 'https://github.com/ionic-sveltekit/create'
};

// Color themes for CLI output
export const COLOR_THEME = {
  primary: '#3880ff',
  secondary: '#3dc2ff',
  success: '#2dd36f',
  warning: '#ffc409',
  danger: '#eb445a',
  dark: '#222428',
  medium: '#92949c',
  light: '#f4f5f8'
};
