import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { RESOURCES } from '../constants.js';

/**
 * Logger class for handling all CLI output
 */
export class Logger {
  constructor() {
    this.spinner = ora();
    this.verbose = false;
  }

  /**
   * Set verbose mode
   */
  setVerbose(verbose) {
    this.verbose = verbose;
    return this;
  }

  /**
   * Show the CLI banner
   */
  showBanner(version) {
    console.log(`
${chalk.blue.bold('╔═══════════════════════════════════════════╗')}
${chalk.blue.bold('║')}      ${chalk.white.bold('Ionic SvelteKit Project Creator')}      ${chalk.blue.bold('║')}
${chalk.blue.bold('╚═══════════════════════════════════════════╝')}
${chalk.gray(`v${version}`)}

${chalk.white('This CLI will help you create a new SvelteKit project')}
${chalk.white('with Ionic UI components for web and mobile apps.')}
`);
  }

  /**
   * Display a success message
   */
  success(message, ...args) {
    console.log(`${logSymbols.success} ${chalk.green(message)}`, ...args);
    return this;
  }

  /**
   * Display an error message
   */
  error(...args) {
    console.error(`${logSymbols.error} `, ...args);
    return this;
  }

  /**
   * Display a warning message
   */
  warn(...args) {
    console.warn(`${logSymbols.warning} `, ...args);
    return this;
  }

  /**
   * Display an info message
   */
  info(...args) {
    console.info(`${logSymbols.info} `, ...args);
    return this;
  }

  /**
   * Display a debug message (only in verbose mode)
   */
  debug(...args) {
    if (this.verbose) {
      console.debug(chalk.gray('debug: '), ...args, '\n');
    }

    return this;
  }

  /**
   * Start a spinner with the given text
   */
  spin(text) {
    this.spinner.text = text;
    this.spinner.start();
    return this;
  }

  /**
   * Stop the spinner with a success message
   */
  succeed(text) {
    this.spinner.succeed(text);
    return this;
  }

  /**
   * Stop the spinner with an error message
   */
  fail(text) {
    this.spinner.fail(text);
    return this;
  }

  /**
   * Display the final success message with instructions
   */
  displayCompletionMessage(options) {
    const pm = options.packagemanager;

    console.log(chalk.bold(chalk.green('\nYour project is ready!')));

    if (options.types === 'typescript') {
      console.log(chalk.bold('✓ TypeScript'));
      console.log(`  Inside Svelte components, use ${chalk.gray('<script lang="ts">')}`);
      console.log(`  ${chalk.cyan(RESOURCES.typescriptDocs)}`);
    } else if (options.types === 'checkjs') {
      console.log(chalk.bold('✓ Type-checked JavaScript'));
      console.log(`  ${chalk.cyan(RESOURCES.typescriptDocs)}`);
    }

    if (options.eslint) {
      console.log(chalk.bold('✓ ESLint'));
      console.log(`  ${chalk.cyan(RESOURCES.eslintDocs)}`);
    }

    if (options.prettier) {
      console.log(chalk.bold('✓ Prettier'));
      console.log(`  ${chalk.cyan(RESOURCES.prettierDocs)}`);
    }

    if (options.playwright) {
      console.log(chalk.bold('✓ Playwright'));
      console.log(`  ${chalk.cyan(RESOURCES.playwrightDocs)}`);
    }

    if (options.vitest) {
      console.log(chalk.bold('✓ Vitest'));
      console.log(`  ${chalk.cyan(RESOURCES.vitestDocs)}`);
    }

    if (options.capacitor) {
      console.log(chalk.bold('✓ Capacitor'));
      console.log(`  ${chalk.cyan(RESOURCES.capacitorDocs)}`);
      console.log(
        chalk.bold(
          '  Please note - the project is configured with HMR - remove server entry in capacitor.config.json for final build'
        )
      );
    }

    if (options.ionicons) {
      console.log(chalk.bold('✓ Ionicons'));
      console.log(`  ${chalk.cyan(RESOURCES.ionicDocs)}`);
    }

    if (options.capacitor) {
      console.log(`\nCapacitor configuration - see: ${chalk.bold(chalk.cyan('capacitor.config.json|ts'))}`);
      console.log(`  App name ${chalk.bold(chalk.cyan(options.name))}`);
      console.log(`  Package name ${chalk.bold(chalk.cyan(options.name + '.ionic.io'))}`);
      console.log(`  Vite dev server url ${chalk.bold(chalk.cyan('http://192.168.137.1:5173/'))}`);
    }

    console.log('\nNext steps:');
    let i = 1;

    const relative = options.name;
    if (relative !== '') {
      console.log(`  ${i++}: ${chalk.bold(chalk.cyan(`cd ${relative}`))}`);
    }

    // prettier-ignore
    if (options.capacitor) {
      console.log(`  ${i++}: ${chalk.bold(chalk.cyan('npm i @capacitor/android'))} and/or ${chalk.bold(chalk.cyan('@capacitor/ios'))}`);
      console.log(`  ${i++}: ${chalk.bold(chalk.cyan('npx cap add android'))} and/or ${chalk.bold(chalk.cyan('ios'))}`);
      console.log(`  ${i++}: ${chalk.bold(chalk.cyan('npm run build'))} to fill the ${chalk.bold(chalk.cyan('build'))} directory`);
      console.log(`  ${i++}: ${chalk.bold(chalk.cyan('npx cap sync'))} sync the build into the target folder`);
      console.log(`  ${i++}: ${chalk.bold(chalk.cyan('npx cap open android'))} or ${chalk.bold(chalk.cyan('ios'))} to open the project and mark as trusted`);
    }
    console.log(`  ${i++}: ${chalk.bold(chalk.cyan('npm run dev -- --open'))}`);
    console.log(`\nTo close the dev server, hit ${chalk.bold(chalk.cyan('Ctrl-C'))}`);

    if (options.capacitor && options.types != 'typescript') {
      console.log(
        `\nWant HMR in Capacitor dev mode? Rename ${chalk.bold(chalk.cyan('_server'))} to ${chalk.bold(chalk.cyan('server'))} in ${chalk.bold(chalk.cyan('capacitor.config.json'))}`
      );
    }
    if (options.capacitor && options.types == 'typescript') {
      console.log(
        `\nUse the ${chalk.bold(chalk.cyan('-hmr'))} flag after your ${chalk.bold(chalk.cyan('npx cap run/open/sync'))} commands to use HMR together with ${chalk.bold(chalk.cyan('npm run dev'))}`
      );
    }

    console.log(
      `\nHint: Make your app offline and near native by turning it into a progressive web app - see ${chalk.cyan(RESOURCES.pwaDocs)}`
    );

    console.log(
      chalk.gray(
        `\nNeed some help or found an issue with this installer? Visit us on Github ${RESOURCES.githubRepo}`
      )
    );
  }
}
