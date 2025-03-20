import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
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
async function executePackageManager(packageManager, args, options = {}) {
  const { cwd = process.cwd(), verbose = false } = options;

  console.debug('executePackageManager', {packageManager, args, cwd});

  try {
    const result = await execa(packageManager, args, {
      cwd,
      stdio: verbose ? 'inherit' : 'pipe',
      // shell: true
    });

    return result;
  } catch (error) {
		console.error('error', error);

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
export async function installDependencies(dependencies, options = {}) {
  const {
    dev = false,
    packageManager = 'npm',
    cwd = process.cwd(),
    verbose = false
  } = options;

  const pm = PM_COMMANDS[packageManager] || PM_COMMANDS.npm;
  const args = [dev ? pm.addDev : pm.add, ...dependencies];

  return executePackageManager(packageManager, args, { cwd, verbose });
}

/**
 * Removes dependencies using the specified package manager
 */
export async function removeDependencies(dependencies, options = {}) {
  const {
    packageManager = 'npm',
    cwd = process.cwd(),
    verbose = false
  } = options;

  const command = packageManager;
  const args = ['remove', ...dependencies];

  return executePackageManager(command, args, { cwd, verbose });
}

/**
 * Runs a script using the specified package manager
 */
export async function runScript(script, options = {}) {
  const {
    packageManager = 'npm',
    cwd = process.cwd(),
    verbose = false
  } = options;

  const pm = PM_COMMANDS[packageManager] || PM_COMMANDS.npm;
  const command = packageManager;
  const args = pm.run ? [pm.run, script] : [script];

  return executePackageManager(command, args, { cwd, verbose });
}

/**
 * Gets the package manager's version
 */
// async function getPackageManagerVersion(packageManager = 'npm') {
//   try {
//     const { stdout } = await execa(packageManager, ['--version']);
//     return stdout.trim();
//   } catch (error) {
//     throw new PackageManagerError(
//       `Failed to get ${packageManager} version`,
//       `${packageManager} --version`,
//       error.stderr
//     );
//   }
// }

/**
 * Checks if a package is installed globally
 */
// async function isPackageInstalledGlobally(packageName, packageManager = 'npm') {
//   try {
//     const { stdout } = await execa(packageManager, ['list', '-g', packageName]);
//     return stdout.includes(packageName);
//   } catch (error) {
//     return false;
//   }
// }
