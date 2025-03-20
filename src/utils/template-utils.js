import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { FileSystemError } from './error-handler.js';

// Get current directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a require function
const require = createRequire(import.meta.url);

/**
 * Gets the path to the example package
 */
function getExamplePath() {
  try {
    // First try to resolve from the specified path
    return path.dirname(require.resolve('@ionic-sveltekit/example/package.json'));
  } catch (error) {
    // If that fails, try to find it in the CLI's node_modules
    try {
      // Get the path to the CLI package root
      const cliRoot = path.resolve(__dirname, '../../');

      // Look in the CLI's node_modules
      const examplePath = path.join(cliRoot, 'node_modules/@ionic-sveltekit/example');
      if (fs.existsSync(path.join(examplePath, 'package.json'))) {
        return examplePath;
      }

      // Try global node_modules as fallback
      const globalPath = path.resolve(process.execPath, '../lib/node_modules/@ionic-sveltekit/example');
      if (fs.existsSync(path.join(globalPath, 'package.json'))) {
        return globalPath;
      }

      throw new Error('Example package not found in node_modules');
    } catch (innerError) {
      throw new FileSystemError(
        'Could not find @ionic-sveltekit/example package. Make sure it is installed.',
        '@ionic-sveltekit/example'
      );
    }
  }
}

/**
 * Processes template variables in a string
 */
function processTemplateVariables(content, variables) {
  if (!variables || Object.keys(variables).length === 0) {
    return content;
  }

  let processed = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    processed = processed.replace(regex, String(value));
  });

  return processed;
}

/**
 * Copies files from the example project
 */
export function copyFromExamplePackage(sourcePath, projectPath, options = {}) {
  const examplePath = getExamplePath();
  const fullSourcePath = path.join(examplePath, sourcePath);
  const destPath = path.join(projectPath, sourcePath);

  try {
    // Check if the source exists
    if (!fs.existsSync(fullSourcePath)) {
      throw new FileSystemError(
        `Source path does not exist in example package: ${sourcePath}`,
        fullSourcePath
      );
    }

    // Get source stats to check if it's a file or directory
    const stats = fs.statSync(fullSourcePath);

    console.debug('copyFromExamplePackage', { sourcePath, projectPath, options, examplePath, fullSourcePath, destPath, isDirectory: stats.isDirectory() });

    if (stats.isDirectory()) {
      // Copy directory
      fs.copySync(fullSourcePath, destPath);

      // Process template variables if needed
      if (options.processTemplates && options.variables) {
        const files = fs.readdirSync(destPath, { recursive: true })
          .filter(file => !fs.statSync(path.join(destPath, file)).isDirectory());

        for (const file of files) {
          const filePath = path.join(destPath, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const processed = processTemplateVariables(content, options.variables);
            fs.writeFileSync(filePath, processed);
          } catch (error) {
            // Skip binary files that can't be read as utf8
            continue;
          }
        }
      }
    } else {
      // Copy file
      fs.copySync(fullSourcePath, destPath);

      // Process template variables if needed
      if (options.processTemplates && options.variables) {
        try {
          const content = fs.readFileSync(destPath, 'utf8');
          const processed = processTemplateVariables(content, options.variables);
          fs.writeFileSync(destPath, processed);
        } catch (error) {
          // Skip binary files that can't be read as utf8
        }
      }
    }

    return destPath;
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    throw new FileSystemError(
      `Failed to copy from example: ${error.message}`,
      { sourcePath: fullSourcePath, destPath }
    );
  }
}
