import chalk from 'chalk';
import logSymbols from 'log-symbols';
import fs from 'fs-extra';
import { RESOURCES } from '../constants.js';

/**
 * Custom error types
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PackageManagerError extends Error {
  constructor(message, command, stderr) {
    super(message);
    this.name = 'PackageManagerError';
    this.command = command;
    this.stderr = stderr;
  }
}

export class FileSystemError extends Error {
  constructor(message, path) {
    super(message);
    this.name = 'FileSystemError';
    this.path = path;
  }
}

/**
 * Central error handler
 */
export function handleError(error) {
  console.error(`\n${logSymbols.error} ${chalk.red('Error:')} ${error.message}`);

  if (error instanceof ValidationError) {
    console.error(chalk.yellow('\nPlease check your input and try again.'));
  }
  else if (error instanceof PackageManagerError) {
    console.error(chalk.yellow('\nPackage manager error details:'));
    console.error(chalk.gray(`  Command: ${error.command}`));
    if (error.stderr) {
      console.error(chalk.gray(`  Error output: ${error.stderr}`));
    }
    console.error(chalk.yellow('\nTry the following:'));
    console.error(chalk.yellow('  1. Check your internet connection'));
    console.error(chalk.yellow('  2. Run with --verbose flag for more details'));
    console.error(chalk.yellow('  3. Try a different package manager with --packagemanager option'));
  }
  else if (error instanceof FileSystemError) {
    console.error(chalk.yellow('\nFile system error details:'));
    console.error(chalk.gray(`  Path: ${error.path}`));
    console.error(chalk.yellow('\nTry the following:'));
    console.error(chalk.yellow('  1. Check file permissions'));
    console.error(chalk.yellow('  2. Use a different path with --path option'));
    console.error(chalk.yellow('  3. Make sure the directory is empty or doesn\'t exist'));
  }

  // If a project directory was created but the process failed, clean it up
  if (error.projectPath && fs.existsSync(error.projectPath)) {
    try {
      console.error(chalk.yellow(`\nCleaning up partially created project at ${error.projectPath}...`));
      fs.removeSync(error.projectPath);
      console.error(chalk.green('Cleanup completed.'));
    } catch (cleanupError) {
      console.error(chalk.red(`Failed to clean up directory: ${cleanupError.message}`));
    }
  }

  console.error(chalk.yellow('\nIf the problem persists, please report this issue at:'));
  console.error(chalk.cyan(`${RESOURCES.githubRepo}/issues`));
}

/**
 * Creates a cleanup function to remove a project directory on error
 */
export function createCleanupHandler(projectPath) {
  return (error) => {
    error.projectPath = projectPath;
    return error;
  };
}
