import validateNpmPackageName from 'validate-npm-package-name';
import fs from 'fs-extra';
import { ValidationError } from './error-handler.js';

/**
 * Validates a project name to ensure it follows npm package naming conventions
 */
export function validateProjectName(name) {
  const result = validateNpmPackageName(name);

  if (!result.validForNewPackages) {
    const errors = [
      ...(result.errors || []),
      ...(result.warnings || [])
    ];

    throw new ValidationError(
      `Invalid project name: "${name}"\n${errors.map(e => `  - ${e}`).join('\n')}`
    );
  }

  return true;
}

/**
 * Validates that a directory does not exist or is empty
 */
export function validateDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);

    // Allow directories with only hidden files/folders
    const nonHiddenFiles = files.filter(file => !file.startsWith('.'));

    if (nonHiddenFiles.length > 0) {
      throw new ValidationError(
        `Directory is not empty: "${dirPath}"\nPlease choose an empty directory or create a new one.`
      );
    }
  }

  return true;
}
