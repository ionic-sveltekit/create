#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for dependencies
async function checkDependencies() {
  try {
    // Check if node_modules exists in the package directory
    const packageDir = path.resolve(__dirname, '..');
    const nodeModulesPath = path.join(packageDir, 'node_modules');

    // Check if dependencies need to be installed
    if (!fs.existsSync(nodeModulesPath) || fs.readdirSync(nodeModulesPath).length === 0) {
      console.log('Installing dependencies...');

      execSync('npm install', { cwd: packageDir, stdio: 'inherit' });

      console.log('Dependencies installed. Continuing...');
    }

    // Import and run the CLI
    const { default: cli } = await import('../src/cli.js');

    if (typeof cli === 'function') {
      cli();
    }
  } catch (error) {
    console.error('Error: ', error);

    process.exit(1);
  }
}

// Run the dependency check and CLI
checkDependencies();
