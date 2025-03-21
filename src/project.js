import { create } from 'sv';
import path from 'path';
import ip from 'ip';
import { Listr } from 'listr2';
import { createDirectory, writeFile, readFile } from './utils/file-system.js';
import { installDependencies, removeDependencies, runPackageManagerScript, detectPackageManager } from './utils/package-manager.js';
import { validateDirectory } from './utils/validation.js';
import { createCleanupHandler } from './utils/error-handler.js';
import { copyFromExamplePackage, modifyTsconfig } from './utils/template-utils.js';

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
              task: async () => {
                // copy static files
                copyFromExamplePackage('static', projectPath, logger);

                // copy example images
                copyFromExamplePackage('src/lib/images', projectPath, logger);

                // copy Ionic theme files
                copyFromExamplePackage('src/theme', projectPath, logger);

                // copy example components
                copyFromExamplePackage('src/lib/components', projectPath, logger, {
                  processTemplates: true,
                  stripTypes: !useTypescript,
                });

                // copy example stores
                copyFromExamplePackage('src/lib/stores', projectPath, logger, {
                  processTemplates: true,
                  stripTypes: !useTypescript,
                });

                // replace SvelteKit defaults with Ionic versions
                copyFromExamplePackage('src/routes', projectPath, logger, {
                  processTemplates: true,
                  stripTypes: !useTypescript,
                  variables: {
                    projectName: options.name,
                    useTypescript,
                  }
                });

                // Write svelte.config.js
                copyFromExamplePackage('svelte.config.js', projectPath, logger);

                // Write initial empty .env file
                copyFromExamplePackage('.env_example', projectPath, logger, {
                  destPath: '.env',
                });

                // Update TypeScript configuration if needed
                if (useTypescript) {
                  // modifyTsconfig(projectPath, logger, options);
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
                    copyFromExamplePackage('capacitor.config.ts', projectPath, logger, {
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
          return task.newListr([
            {
              title: 'Installing development dependencies',
              task: async () => {
                const devDeps = ['svelte-preprocess', '@sveltejs/adapter-static'];

                if (options.capacitor) {
                  devDeps.push('@capacitor/cli');
                }

                await installDependencies(devDeps, logger, {
                  dev: true,
                  packageManager: ctx.packageManager,
                  cwd: projectPath,
                  verbose: options.verbose
                });
              }
            },
            {
              title: 'Installing production dependencies',
              task: async () => {
                const deps = ['@ionic-sveltekit/core', '@ionic-sveltekit/components'];

                if (options.capacitor) {
                  deps.push('@capacitor/core');
                }

                if (options.ionicons) {
                  deps.push('ionicons');
                }

                await installDependencies(deps, logger, {
                  dev: false,
                  packageManager: ctx.packageManager,
                  cwd: projectPath,
                  verbose: options.verbose
                });
              }
            },
            {
              title: 'Removing unused dependencies',
              task: async () => {
                await removeDependencies(['@sveltejs/adapter-auto'], logger, {
                  packageManager: ctx.packageManager,
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
        task: async (ctx, task) => {
          return task.newListr([
            {
              title: 'Running build script',
              task: async () => {
                try {
                  // build the project
                  await runPackageManagerScript('build', logger, {
                    packageManager: ctx.packageManager,
                    cwd: projectPath,
                    verbose: options.verbose
                  });
                } catch (error) {
                  logger.warn('Failed to build project: ' + error.message);
                }
              }
            },
          ]);
        },
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
