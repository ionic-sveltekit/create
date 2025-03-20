import { execa } from 'execa';
import fs from 'fs-extra';
import { PM_COMMANDS } from '../constants.js';
import { PackageManagerError } from './error-handler.js';

/**
 * Detects which package manager is running the script
 */
export function detectPackageManager() {
  // Check if script is being run via npm/yarn/pnpm
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.includes('yarn')) return 'yarn';
    if (userAgent.includes('pnpm')) return 'pnpm';
    if (userAgent.includes('npm')) return 'npm';
  }

  // Check for lock files in the current directory
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('package-lock.json')) return 'npm';

  // Default to npm
  return 'npm';
}

/**
 * Executes a package manager command
 */
async function executePackageManager(packageManager, args, logger, options = {}) {
  const { cwd = process.cwd(), verbose = false } = options;

  logger.debug('executePackageManager', {packageManager, args, cwd});

  try {
    const result = await execa(packageManager, args, {
      cwd,
      stdio: verbose ? 'inherit' : 'pipe',
      shell: true
    });

    return result;
  } catch (error) {
    if (options.verbose) {
      logger.error('executePackageManager error: ', error);
    }

    throw new PackageManagerError(
      `Failed to execute package manager command: ${packageManager} ${args.join(' ')}`,
      `${packageManager} ${args.join(' ')}`,
      error.stderr
    );
  }
}

/**
 * Installs dependencies using the specified package manager
 */
export async function installDependencies(dependencies, logger, options = {}) {
  const {
    dev = false,
    packageManager = 'npm',
    cwd = process.cwd(),
    verbose = false
  } = options;

  const pm = PM_COMMANDS[packageManager] || PM_COMMANDS.npm;
  const args = [dev ? pm.addDev : pm.add, ...dependencies];

  return executePackageManager(packageManager, args, logger, { cwd, verbose });
}

/**
 * Removes dependencies using the specified package manager
 */
export async function removeDependencies(dependencies, logger, options = {}) {
  const {
    packageManager = 'npm',
    cwd = process.cwd(),
    verbose = false
  } = options;

  const args = ['remove', ...dependencies];

  return executePackageManager(packageManager, args, logger, { cwd, verbose });
}

/**
 * Runs a script using the specified package manager
 */
export async function runPackageManagerScript(script, logger, options = {}) {
  const {
    packageManager = 'npm',
    cwd = process.cwd(),
    verbose = false
  } = options;

  const pm = PM_COMMANDS[packageManager] ?? PM_COMMANDS.npm;
  const args = pm.run ? [pm.run, script] : [script];

  return executePackageManager(packageManager, args, logger, { cwd, verbose });
}
