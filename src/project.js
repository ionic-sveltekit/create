import { create } from 'sv';
import path from 'path';
import fs from 'fs-extra';
import ip from 'ip';
import { Listr } from 'listr2';
import { createDirectory, writeFile, readFile } from './utils/file-system.js';
import { installDependencies, removeDependencies, runScript, detectPackageManager } from './utils/package-manager.js';
import { validateDirectory, validateWritableDirectory } from './utils/validation.js';
import { createCleanupHandler, FileSystemError } from './utils/error-handler.js';
import { copyFromExamplePackage } from './utils/template-utils.js';

/**
 * Creates a new Ionic SvelteKit project
 */
export async function createProject(options, logger) {
  // Validate project path
  const projectPath = path.resolve(options.path, options.name.replace(/\s+/g, '-').toLowerCase());

  // Check if directory exists and is empty
  validateDirectory(projectPath);

  // Create the project directory
  createDirectory(projectPath);

  // Prepare error handler for cleanup
  const cleanupHandler = createCleanupHandler(projectPath);

  const useTypescript = options.types === 'typescript';

  try {
    // Setup task list
    const tasks = new Listr([
      {
        title: 'Creating base SvelteKit project',
        task: async () => {
          // Create base SvelteKit project
          await create(projectPath, { ...options, template: 'minimal'});
        }
      },
      {
        title: 'Setting up project structure',
        task: async (ctx, task) => {
          // Change to project directory
          process.chdir(projectPath);

          // Detect package manager
          ctx.packageManager = options.packagemanager || detectPackageManager();

          return task.newListr([
            {
              title: 'Creating directories',
              task: () => {
                // Create any additional directories if needed beyond what create-svelte makes
                createDirectory(path.join(projectPath, 'src', 'lib', 'components'));
                createDirectory(path.join(projectPath, 'src', 'theme'));

                if (options.capacitor) {
                  createDirectory(path.join(projectPath, 'capacitor'));
                }
              }
            },
            {
              title: 'Copying template files',
              task: () => {
                // copy Ionic theme files
                copyFromExamplePackage('src/theme', projectPath);

                // copy component files
                copyFromExamplePackage('src/lib/components', projectPath);

                // copy static files
                copyFromExamplePackage('static', projectPath);

                // replace SvelteKit defaults with Ionic versions
                copyFromExamplePackage('src/routes', projectPath, {
                  processTemplates: true,
                  variables: {
                    projectName: options.name,
                    useTypescript,
                  }
                });

                // Write svelte.config.js
                copyFromExamplePackage('svelte.config.js', projectPath);

                // Disable SSR
                writeFile(
                  path.join(projectPath, 'src', 'routes', '+layout.ts'),
                  'export const ssr = false;\n'
                );

                // Update TypeScript configuration if needed
                if (useTypescript) {
                  try {
                    const tsconfig = readFile(path.join(projectPath, 'tsconfig.json'), 'utf-8');
                    const tsconfignew = tsconfig.replace(
                      '"compilerOptions": {',
                      `"compilerOptions": {
    "verbatimModuleSyntax": true,
    "typeRoots": [
      "./node_modules/ionic-svelte"
    ],
    "types": [
      "ionic-svelte"
    ],`
                    );

                    writeFile(path.join(projectPath, 'tsconfig.json'), tsconfignew);
                  } catch (error) {
                    logger.warn('Unable to update tsconfig.json - ' + error.message);
                  }
                }

                // Setup Capacitor if needed
                if (options.capacitor) {
                  // Update package.json for hot reload support
                  try {
                    const pkg = readFile(path.join(projectPath, 'package.json'), 'utf-8');
                    const pkgNew = pkg.replace(
                      '"dev": "vite dev"',
                      '"dev": "vite dev --host"'
                    );

                    writeFile(path.join(projectPath, 'package.json'), pkgNew);
                  } catch (error) {
                    logger.warn('Unable to update package.json - ' + error.message);
                  }

                  // Create Capacitor config
                  const capacitorVars = {
                    appId: options.name + '.ionic.io',
                    appName: options.name,
                    serverUrl: `http://${ip.address()}:5173/`
                  };

                  if (useTypescript) {
                    copyFromExamplePackage('capacitor.config.ts', projectPath, {
                      processTemplates: true,
                      variables: capacitorVars
                    });
                  } else {
                    // Create JSON version for non-TypeScript projects
                    writeFile(
                      path.join(projectPath, 'capacitor.config.json'),
                      JSON.stringify({
                        webDir: "build",
                        appId: capacitorVars.appId,
                        appName: capacitorVars.appName,
                        _server: {
                          url: capacitorVars.serverUrl,
                          cleartext: true
                        }
                      }, null, 2)
                    );
                  }
                }
              }
            }
          ]);
        }
      },
      {
        title: 'Installing dependencies',
        task: async (ctx, task) => {
          const pm = ctx.packageManager;

          return task.newListr([
            {
              title: 'Installing development dependencies',
              task: async () => {
                // const devDeps = ['svelte-preprocess', '@sveltejs/adapter-static'];
                // const devDeps = ['svelte-preprocess'];
                const devDeps = ['@sveltejs/adapter-static'];

                if (options.capacitor) {
                  devDeps.push('@capacitor/cli');
                }

                await installDependencies(devDeps, {
                  dev: true,
                  packageManager: pm,
                  cwd: projectPath,
                  verbose: options.verbose
                });
              }
            },
            {
              title: 'Installing production dependencies',
              task: async () => {
                const deps = ['@ionic/core@8.2.2', 'ionic-svelte'];

                if (options.capacitor) {
                  deps.push('@capacitor/core');
                }

                if (options.ionicons) {
                  deps.push('ionicons');
                }

                await installDependencies(deps, {
                  dev: false,
                  packageManager: pm,
                  cwd: projectPath,
                  verbose: options.verbose
                });
              }
            },
            {
              title: 'Removing unused dependencies',
              task: async () => {
                await removeDependencies(['@sveltejs/adapter-auto'], {
                  packageManager: pm,
                  cwd: projectPath,
                  verbose: options.verbose
                });
              }
            }
          ]);
        }
      },
      {
        title: 'Finalizing project',
        task: async (ctx) => {
          // Run prettier if enabled
          if (options.prettier) {
            try {
              await runScript('format', {
                packageManager: ctx.packageManager,
                cwd: projectPath,
                verbose: options.verbose
              });
            } catch (error) {
              logger.warn('Failed to run Prettier - ' + error.message);
            }
          }
        }
      }
    ], {
      rendererOptions: {
        collapseSubtasks: false,
        collapseErrors: false,
        showSubtasks: true
      }
    });

    // Run tasks
    await tasks.run();

    // Display completion message
    logger.displayCompletionMessage(options);

    return projectPath;
  } catch (error) {
    // Add project path to error for cleanup
    throw cleanupHandler(error);
  }
}
