#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

// Check if node_modules exists in the package directory
const packageDir = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(packageDir, 'node_modules');

if (!fs.existsSync(nodeModulesPath) || fs.readdirSync(nodeModulesPath).length === 0) {
  console.log('Installing dependencies...');

	try {
    execSync('npm install', { cwd: packageDir, stdio: 'inherit' });

		// Continue with your CLI tool's main logic
		console.log('Dependencies installed. Continuing...');
  } catch (error) {
    console.error('Failed to install dependencies:', error);

		process.exit(1);
  }
}

// Import your actual CLI implementation
import('../src/cli.js');
