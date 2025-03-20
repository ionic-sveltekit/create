# @ionic-sveltekit/create

A command-line tool for creating new projects using SvelteKit and Ionic Framework.

## Overview

This CLI tool simplifies the process of setting up a new SvelteKit project with Ionic UI components for web and mobile applications. It provides an interactive setup process with sensible defaults while allowing advanced configuration via command-line options.

## Installation

You can use the tool directly via npx without installing it:

```bash
npx @ionic-sveltekit/create my-app
```

Or you can install it globally:

```bash
npm install -g @ionic-sveltekit/create
```

## Usage

### Interactive Mode

The easiest way to use the tool is in interactive mode:

```bash
npx @ionic-sveltekit/create
```

This will prompt you to enter:
- Project name
- TypeScript preferences
- Code quality tools (ESLint, Prettier)
- Testing frameworks (Playwright, Vitest)
- Ionic components options (Ionicons, Capacitor)

### Non-Interactive Mode

You can skip the prompts by using the `--defaults` flag:

```bash
npx @ionic-sveltekit/create my-app --defaults
```

This will create a project with default settings.

### Command-Line Options

You can customize your project by providing command-line options:

```bash
npx @ionic-sveltekit/create my-app [options]
```

#### Available Options

| Option | Description | Default |
| --- | --- | --- |
| `--path <path>` | Location to install (project name is appended) | `.` |
| `--types <type>` | Add type checking with TypeScript | `typescript` |
| `--eslint [boolean]` | Add ESLint for code linting | `true` |
| `--prettier [boolean]` | Add Prettier for code formatting | `true` |
| `--playwright [boolean]` | Add Playwright for browser testing | `false` |
| `--vitest [boolean]` | Add Vitest for unit testing | `false` |
| `--ionicons [boolean]` | Include Ionic icon library | `true` |
| `--capacitor [boolean]` | Install dependencies for Capacitor | `false` |
| `--verbose` | Show detailed output for troubleshooting | `false` |
| `--defaults` | Skip all prompts and use default values | `false` |

### Examples

Create a new project with default settings:
```bash
npx @ionic-sveltekit/create my-app --defaults
```

Create a project with specific options:
```bash
npx @ionic-sveltekit/create my-app --types typescript --eslint --prettier --capacitor
```

Create a JavaScript-only project:
```bash
npx @ionic-sveltekit/create my-app --types none
```

Create a project with TypeScript using JSDoc comments:
```bash
npx @ionic-sveltekit/create my-app --types checkjs
```

## Project Structure

The created project will have the following structure:

```
my-app/
├── src/
│   ├── lib/
│   │   ├── components/    # Reusable Svelte components
│   │   └── images/        # Project images
│   ├── routes/            # SvelteKit routes
│   └── theme/             # Ionic theme files
├── static/                # Static assets
├── .env                   # Environment variables
├── svelte.config.js       # SvelteKit configuration
└── package.json           # Project dependencies
```

If Capacitor is enabled, a `capacitor/` directory and `capacitor.config.json|ts` file will also be created.

## Features

- **SvelteKit Integration**: Creates a SvelteKit project with Ionic UI components
- **TypeScript Support**: Full TypeScript support with optional JS+JSDoc alternative
- **Code Quality**: Optional ESLint and Prettier integration
- **Testing**: Optional Playwright and Vitest setup
- **Mobile Development**: Optional Capacitor integration for mobile app deployment
- **Ionic Components**: Pre-configured Ionic theme and components

## Next Steps After Creation

After creating your project:

1. Navigate to the project directory: `cd my-app`
2. Start the development server: `npm run dev -- --open`

### For Capacitor Projects

If you enabled Capacitor:

1. Install platform-specific packages:
   ```bash
   npm i @capacitor/android
   # and/or
   npm i @capacitor/ios
   ```

2. Add platforms:
   ```bash
   npx cap add android
   # and/or
   npx cap add ios
   ```

3. Build your app:
   ```bash
   npm run build
   ```

4. Sync the build with Capacitor:
   ```bash
   npx cap sync
   ```

5. Open the project in the native IDE:
   ```bash
   npx cap open android
   # or
   npx cap open ios
   ```

## Hot Module Replacement with Capacitor

- For TypeScript projects: Use the `-hmr` flag with Capacitor commands
- For JavaScript projects: Rename `_server` to `server` in `capacitor.config.json`

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/tsconfig#checkJs)
- [ESLint Plugin for Svelte](https://sveltejs.github.io/eslint-plugin-svelte/)
- [Prettier Documentation](https://prettier.io/docs/en/options.html)
- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Capacitor Documentation](https://capacitorjs.com/docs/getting-started)
- [Ionic Icons Documentation](https://ionic.io/ionicons)
- [PWA Documentation](https://github.com/vite-pwa/sveltekit)

## Issues and Support

If you encounter any issues or need help, please report them at:
[GitHub Repository](https://github.com/ionic-sveltekit/create/issues)

## License

[MIT](LICENSE)
