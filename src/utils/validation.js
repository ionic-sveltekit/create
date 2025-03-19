import validateNpmPackageName from 'validate-npm-package-name';
import fs from 'fs-extra';
import path from 'path';
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

/**
 * Validates that a project path is writable
 */
export function validateWritableDirectory(dirPath) {
  try {
    // Create the directory if it doesn't exist
    fs.ensureDirSync(dirPath);

    // Check if we can write to it
    const testFile = path.join(dirPath, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);

    return true;
  } catch (error) {
    throw new ValidationError(
      `Cannot write to directory: "${dirPath}"\nPlease check permissions or choose a different directory.`
    );
  }
}

/**
 * Validates boolean options from command line
 */
export function validateBooleanOption(value) {
  if (typeof value === 'boolean') return value;

  const stringValue = String(value).toLowerCase();
  if (['true', 'yes', 'y', '1'].includes(stringValue)) return true;
  if (['false', 'no', 'n', '0'].includes(stringValue)) return false;

  throw new ValidationError(
    `Invalid boolean value: "${value}"\nPlease use true/false, yes/no, y/n, or 1/0.`
  );
}

/**
 * Validates TypeScript options
 */
export function validateTypeScriptOption(value) {
  const validOptions = ['typescript', 'checkjs', null, 'false', false];

  if (validOptions.includes(value)) {
    if (value === 'false' || value === false) return null;
    return value;
  }

  throw new ValidationError(
    `Invalid TypeScript option: "${value}"\nPlease use 'typescript', 'checkjs', or false.`
  );
}

/**
 * Validates that all required options are present
 */
export function validateRequiredOptions(options, required = ['name']) {
  const missing = required.filter(key => !options[key]);

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required option(s): ${missing.join(', ')}`
    );
  }

  return true;
}
