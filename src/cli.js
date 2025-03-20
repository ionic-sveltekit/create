import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';
import { DEFAULT_OPTIONS, OPTION_DESCRIPTIONS } from './constants.js';
import { getProjectOptions } from './prompt.js';
import { createProject } from './project.js';
import { Logger } from './logger.js';
import { validateProjectName } from './utils/validation.js';
import { detectPackageManager } from './utils/package-manager.js';

// Get package version
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagePath = path.resolve(__dirname, '../package.json');
const { version } = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

/**
 * Creates and configures the CLI
 */
export function createCLI() {
  const program = new Command();
  const logger = new Logger();

  program
    .name('@ionic-sveltekit/create')
    .description(chalk.blue('Create a new Ionic SvelteKit project'))
    .version(version, '-v, --version', 'Output the current version')
    .argument('[project-name]', OPTION_DESCRIPTIONS.name)
    .option('--path <path>', OPTION_DESCRIPTIONS.path, DEFAULT_OPTIONS.path)
    .option('--types <type>', OPTION_DESCRIPTIONS.types)
    .option('--eslint [boolean]', OPTION_DESCRIPTIONS.eslint)
    .option('--prettier [boolean]', OPTION_DESCRIPTIONS.prettier)
    .option('--playwright [boolean]', OPTION_DESCRIPTIONS.playwright)
    .option('--vitest [boolean]', OPTION_DESCRIPTIONS.vitest)
    .option('--ionicons [boolean]', OPTION_DESCRIPTIONS.ionicons)
    .option('--capacitor [boolean]', OPTION_DESCRIPTIONS.capacitor)
    .option('--verbose', OPTION_DESCRIPTIONS.verbose)
    .option('--defaults', OPTION_DESCRIPTIONS.defaults)
    .hook('preAction', async (thisCommand) => {
      // Display banner
      logger.showBanner(version);
    })
    .action(async (projectName, options) => {
      logger.setVerbose(options.verbose);

      try {
        // Set project name from argument if provided
        if (projectName) {
          validateProjectName(projectName);
          options.name = projectName;
        }

        // Convert string boolean values to actual booleans
        const booleanOptions = [
          'eslint', 'prettier', 'playwright', 'vitest', 'ionicons', 'capacitor'
        ];
        booleanOptions.forEach(opt => {
          if (options[opt] === 'true') options[opt] = true;
          if (options[opt] === 'false') options[opt] = false;
        });

        // Auto-detect package manager if not specified
        if (!options.packagemanager) {
          options.packagemanager = detectPackageManager();
        }

        // Determine interactive or non-interactive mode
        const isInteractive = !options.defaults;

        logger.debug("Interactive mode:", isInteractive);
        logger.debug("Initial options:", options);

        // Get project options through interactive prompts if needed
        const projectOptions = isInteractive
          ? await getProjectOptions(options)
          : { ...DEFAULT_OPTIONS, ...options };

        logger.debug("Final options:", projectOptions);

        // Create the project
        await createProject(projectOptions, logger);

      } catch (error) {
        logger.error(error.message);

        process.exit(1);
      }
    });

  // Parse arguments and run the program
  program.parse();

  return program;
}
