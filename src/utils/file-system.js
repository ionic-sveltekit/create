import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { FileSystemError } from './error-handler.js';

// Get current directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gets the absolute path to a file in the package
 */
export function getPackagePath(relativePath) {
  // Navigate from utils directory to the package root
  return path.resolve(__dirname, '../../', relativePath);
}

/**
 * Gets the absolute path to a template file
 */
export function getTemplatePath(templateName, fileName) {
  return getPackagePath(`src/templates/${templateName}/${fileName}`);
}

/**
 * Safely creates a directory and its parents if needed
 */
export function createDirectory(dirPath) {
  try {
    fs.ensureDirSync(dirPath);
    return dirPath;
  } catch (error) {
    throw new FileSystemError(`Failed to create directory: ${dirPath}`, dirPath);
  }
}

/**
 * Safely writes content to a file
 */
export function writeFile(filePath, content) {
  try {
    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    fs.ensureDirSync(dirPath);

    // Write the file
    fs.writeFileSync(filePath, content);
    return filePath;
  } catch (error) {
    throw new FileSystemError(`Failed to write file: ${filePath}`, filePath);
  }
}

/**
 * Safely reads content from a file
 */
export function readFile(filePath, options = {}) {
  try {
    return fs.readFileSync(filePath, options);
  } catch (error) {
    throw new FileSystemError(`Failed to read file: ${filePath}`, filePath);
  }
}

/**
 * Copies template files to the destination
 */
export function copyTemplateFiles(templateName, destinationPath, variables = {}) {
  const templatePath = getPackagePath(`src/templates/${templateName}`);

  try {
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      throw new FileSystemError(`Template not found: ${templateName}`, templatePath);
    }

    // Get all files in the template
    const files = glob.sync('**/*', {
      cwd: templatePath,
      nodir: true,
      dot: true
    });

    // Copy each file and replace variables
    for (const file of files) {
      const sourcePath = path.join(templatePath, file);
      const destPath = path.join(destinationPath, file);

      // Read the file content
      let content = fs.readFileSync(sourcePath, 'utf8');

      // Replace variables in the content
      if (Object.keys(variables).length > 0) {
        Object.entries(variables).forEach(([key, value]) => {
          content = content.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(value));
        });
      }

      // Write the file
      writeFile(destPath, content);
    }

    return destinationPath;
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new FileSystemError(`Failed to copy template files: ${error.message}`, templatePath);
  }
}

/**
 * Deletes a directory or file
 */
export function deleteItem(itemPath) {
  try {
    if (fs.existsSync(itemPath)) {
      fs.removeSync(itemPath);
      return true;
    }
    return false;
  } catch (error) {
    throw new FileSystemError(`Failed to delete item: ${itemPath}`, itemPath);
  }
}

/**
 * Checks if a path is writable
 */
export function isWritable(path) {
  try {
    fs.accessSync(path, fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
}
