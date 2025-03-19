#!/usr/bin/env node

import { createCLI } from '../src/cli.js';
import { handleError } from '../src/utils/error-handler.js';

// Run the CLI
try {
  createCLI();
} catch (error) {
  handleError(error);
  process.exit(1);
}
