import inquirer from 'inquirer';
import { DEFAULT_OPTIONS, PROMPT_MESSAGES } from './constants.js';
import { validateProjectName } from './utils/validation.js';

/**
 * Gets project options through interactive prompts
 */
export async function getProjectOptions(options = {}) {
  // Start with existing options but don't apply defaults yet
  const projectOptions = { ...options };

  // Prepare questions for missing options
  const questions = [];

  // Project name
  if (!projectOptions.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: PROMPT_MESSAGES.projectName,
      default: DEFAULT_OPTIONS.name,
      validate: (input) => {
        try {
          validateProjectName(input);
          return true;
        } catch (error) {
          return error.message;
        }
      }
    });
  }

  // TypeScript option - Always ask unless explicitly specified
  if (!('types' in projectOptions)) {
    questions.push({
      type: 'list',
      name: 'types',
      message: PROMPT_MESSAGES.typescriptChoice,
      default: DEFAULT_OPTIONS.types,
      choices: [
        {
          name: 'Yes, using TypeScript syntax',
          value: 'typescript'
        },
        {
          name: 'Yes, using JavaScript with JSDoc comments',
          value: 'checkjs'
        },
        {
          name: 'No',
          value: null
        }
      ]
    });
  }

  // ESLint option
  if (!('eslint' in projectOptions)) {
    questions.push({
      type: 'confirm',
      name: 'eslint',
      message: PROMPT_MESSAGES.eslintChoice,
      default: DEFAULT_OPTIONS.eslint
    });
  }

  // Prettier option
  if (!('prettier' in projectOptions)) {
    questions.push({
      type: 'confirm',
      name: 'prettier',
      message: PROMPT_MESSAGES.prettierChoice,
      default: DEFAULT_OPTIONS.prettier
    });
  }

  // Playwright option
  if (!('playwright' in projectOptions)) {
    questions.push({
      type: 'confirm',
      name: 'playwright',
      message: PROMPT_MESSAGES.playwrightChoice,
      default: DEFAULT_OPTIONS.playwright
    });
  }

  // Vitest option
  if (!('vitest' in projectOptions)) {
    questions.push({
      type: 'confirm',
      name: 'vitest',
      message: PROMPT_MESSAGES.vitestChoice,
      default: DEFAULT_OPTIONS.vitest
    });
  }

  // Ionicons option
  if (!('ionicons' in projectOptions)) {
    questions.push({
      type: 'confirm',
      name: 'ionicons',
      message: PROMPT_MESSAGES.ioniconsChoice,
      default: DEFAULT_OPTIONS.ionicons
    });
  }

  // Capacitor option
  if (!('capacitor' in projectOptions)) {
    questions.push({
      type: 'confirm',
      name: 'capacitor',
      message: PROMPT_MESSAGES.capacitorChoice,
      default: DEFAULT_OPTIONS.capacitor
    });
  }

  console.log(`Will ask ${questions.length} questions.`);

  // If there are questions, prompt the user
  if (questions.length > 0) {
    const answers = await inquirer.prompt(questions);
    console.log("User answers:", answers);

    // Merge answers with options
    Object.assign(projectOptions, answers);
  }

  // Fill in defaults for any remaining options
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...projectOptions
  };

  return finalOptions;
}
