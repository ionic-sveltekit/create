// Types
import { create } from 'create-svelte';
import fs from 'fs-extra';
import ip from 'ip';
import { bold, grey, red } from 'kleur/colors';
import { spawnSync } from 'node:child_process';
import path from 'path';
import process from 'process';
import {
  getDemoIonicApp,
  getIonicVariables,
  parseCapacitorConfig,
  mkdirp,
  whichPMRuns,
  parseLayout,
  parseTabsComponent,
  getHelperUtility,
} from './utils.js';

// NOTE: Any changes here must also be reflected in the --help output in utils.ts and shortcut expansions in bin.ts.
// Probably a good idea to do a search on the values you are changing to catch any other areas they are used in
// Codebase would be a lot cleaner if Reflect() actually returned anything useful.
// unbuild doesn't seem to like it when SkeletonOptions implements the Options type from create-svelte's internal type definitions
// so they are copied over here just to make everything even more brittle.

export class IonicSvelteOptions {
  // svelte-create expects these options, do not change the names or values.
  name = 'new-ionic-svelte-app';
  template = 'skeleton';
  types = 'typescript';
  prettier = false;
  eslint = true;
  playwright = false;
  vitest = false;

  // Ionic
  ionicons = false;
  capacitor = false;

  // create-skeleton-app additions
  // _ = []; //catch all for extraneous params from mri, used to capture project name.
  help = false;
  quiet = false;
  framework = 'svelte-kit';
  path = '.';
  // forms = false;
  // typography = false;
  // lineclamp = false;
  // skeletontheme = 'skeleton';
  // skeletontemplate = 'bare';
  packagemanager = 'npm';
  // // props below are private to the Skeleton team
  verbose = false;
  // monorepo = false;
  packages = [];
  // skeletonui = true;
  // skeletontemplatedir = '../templates';
  workspace = '';
}

export async function createIonicSvelte(opts) {
  //create-svelte will happily overwrite an existing directory, foot guns are bad mkay

  let s = 0;
  opts.verbose = true;

  opts.path = path.resolve(opts?.path, opts.name.replace(/\s+/g, '-').toLowerCase());

  if (fs.existsSync(opts.path)) {
    console.error(red(bold('Install directory already exists!')));
    process.exit();
  }

  if (!opts?.quiet) {
    console.log('Working: Creating base Svelte Kit install supercharged with Ionic.');
  }
  fs.mkdirp(opts.path);

  //create-svelte will build the base install for us
  // npm create svelte@latest my-project
  create(opts.path, opts);

  process.chdir(opts.path);

  // install packages
  opts.packagemanager = whichPMRuns()?.name || 'npm';

  // the order matters due to dependency resolution, because yarn
  let packages = ['svelte-preprocess', '@sveltejs/adapter-static']; //
  if (opts?.capacitor) packages.push('@capacitor/cli');

  // if (opts?.typography) packages.push('@tailwindcss/typography');
  // if (opts?.forms) packages.push('@tailwindcss/forms');
  // if (opts?.lineclamp) packages.push('@tailwindcss/line-clamp');

  if (!opts?.quiet) {
    console.log('Working: Installing project dependencies ' + grey(packages.toString()));
  }

  // packages = [];
  let result = spawnSync(opts.packagemanager, ['add', '-D', ...packages], {
    shell: true
  });

  if (
    opts.packagemanager != 'yarn' &&
    result?.stderr.toString().length &&
    (result?.stderr.toString().includes('ERR_PNPM') || result?.stderr.toString().includes('ERR!'))
  ) {
    console.log(
      'Create-Ionic-Svelte App - we received an error from the package manager - please submit issue on https://github.com/Tommertom/svelte-ionic-npm/issues \n',
      result?.stderr.toString()
    );
    process.exit();
  }

  packages = ['@ionic/core@8.2.2', 'ionic-svelte'];
  if (opts?.capacitor) packages.push('@capacitor/core');
  // packages = [];
  if (opts?.ionicons) packages.push('ionicons');

  console.log('Working: Adding ' + grey(packages.toString()));

  result = spawnSync(opts.packagemanager, ['add', '-S', ...packages], {
    shell: true
  });
  if (
    opts.packagemanager != 'yarn' &&
    result?.stderr.toString().length &&
    (result?.stderr.toString().includes('ERR_PNPM') || result?.stderr.toString().includes('ERR!'))
  ) {
    console.log(
      'Create-Ionic-Svelte App - we received an error from the package manager - please submit issue on https://github.com/Tommertom/svelte-ionic-npm/issues \n',
      result?.stderr.toString()
    );
    process.exit();
  }

  packages = ['@sveltejs/adapter-auto'];
  console.log('Working: Removing ' + grey(packages.toString()));
  result = spawnSync(opts.packagemanager, ['remove', '-D', ...packages], {
    shell: true
  });
  if (
    opts.packagemanager != 'yarn' &&
    result?.stderr.toString().length &&
    (result?.stderr.toString().includes('ERR_PNPM') || result?.stderr.toString().includes('ERR!'))
  ) {
    console.log(
      'Create-Ionic-Svelte App - we received an error from the package manager - please submit issue on https://github.com/Tommertom/svelte-ionic-npm/issues \n',
      result?.stderr.toString()
    );
    process.exit();
  }

  // Just to help with any user error reports
  // if (opts.verbose) {
  // 	const stdout = result?.stdout.toString();
  // 	if (stdout.length) console.log(bold(cyan('stdout:')), stdout);
  // 	const stderr = result?.stderr.toString();
  // 	if (stderr.length) console.log(bold(red('stderr:')), stderr);
  // }

  console.log('Working: Writing configs and default files');
  out('svelte.config.js', createSvelteConfig());

  if (opts.framework == 'svelte-kit' || opts.framework == 'svelte-kit-lib') {
    const useTypescript = opts.types === 'typescript';

    mkdirp(path.join('src', 'lib'));
    mkdirp(path.join('src', 'theme'));

    out(path.resolve(process.cwd(), 'src/theme/', 'variables.css'), getIonicVariables());

    out(path.resolve(process.cwd(), 'src/lib/utilities/', 'helper.js'), getHelperUtility());

    out(path.resolve(process.cwd(), 'src/routes/', '+layout.ts'), 'export const ssr = false;\n');

    out(path.resolve(process.cwd(), 'src/routes/', '+layout.svelte'), parseLayout(useTypescript));

    out(path.resolve(process.cwd(), 'src/lib/components/', 'Tabs.svelte'), parseTabsComponent(useTypescript));

    out(path.resolve(process.cwd(), 'src/routes/', '+page.svelte'), parsePage1(useTypescript));

    out(path.resolve(process.cwd(), 'src/routes/planets/', '+page.svelte'), parsePage2(useTypescript));

    out(path.resolve(process.cwd(), 'src/routes/planets/earth/', '+page.svelte'), parsePage3(useTypescript));

    // tsconfig
    if (useTypescript) {
      try {
        const tsconfig = fs.readFileSync('tsconfig.json', 'utf-8');
        //	console.log('Reading tsconfig ', tsconfig);
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

        //	console.log('New tsconfig ', tsconfignew);
        out(path.resolve(process.cwd(), './', 'tsconfig.json'), tsconfignew);
      } catch (e) {
        console.warn('TSconfig read/write error - ', e);
      }
    }

    // capacitor
    if (opts?.capacitor) {
      // hot reload support - change the vite build script
      try {
        const packagagejson = fs.readFileSync('package.json', 'utf-8');
        //	console.log('Reading tsconfig ', tsconfig);
        const packagagejsonnew = packagagejson.replace(
          '"dev": "vite dev"',
          `"dev": "vite dev --host"`
        );

        //	console.log('New tsconfig ', tsconfignew);
        out(path.resolve(process.cwd(), './', 'package.json'), packagagejsonnew);
      } catch (e) {
        console.warn('TSconfig read/write error - ', e);
      }

      if (useTypescript) {
        out(
          'capacitor.config.ts',
          parseCapacitorConfig({
            appId: opts.name + '.ionic.io',
            appName: opts.name,
            ip: ip.address() // 'http://192.168.137.1'
          })
        );
      } else {
        out(
          'capacitor.config.json',
          `{
		"webDir":"build",
		"appId":"${opts.name}.ionic.io",
		"appName":"${opts.name}",
		"_server": {
		  "url": "http://${ip.address()}:5173/",
		  "cleartext": true
		}
	}`
        );
      }
    }
  }

  // close with prettier
  if (opts?.prettier) {
    console.log('Working: Running Prettier on all files');
    result = spawnSync(opts.packagemanager, ['run', 'format'], {
      shell: true
    });

    if (
      opts.packagemanager !== 'yarn' &&
      result?.stderr.toString().length &&
      (result?.stderr.toString().includes('ERR_PNPM') || result?.stderr.toString().includes('ERR!'))
    ) {
      console.log(
        'Create-Ionic-Svelte App - we received an error from the package manager - please submit issue on https://github.com/Tommertom/svelte-ionic-npm/issues \n',
        result?.stderr.toString()
      );
      process.exit();
    }
  }

  return opts;
}

function createSvelteConfig() {
  return `import adapter from '@sveltejs/adapter-static'
import { sveltePreprocess } from "svelte-preprocess";


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess : sveltePreprocess(),
	kit        : {
		adapter : adapter({
			pages       : 'build',
			assets      : 'build',
			fallback    : 'index.html',
			precompress : false,
		}),
		alias   : {
			// file path shortcuts
			'$actions'    : './src/lib/actions',
      '$images'     : './src/lib/images',
			'$components' : './src/lib/components',
			'$services'   : './src/lib/services',
			'$stores'     : './src/lib/stores',
			'$types'      : './src/lib/types',
			'$utilities'  : './src/lib/utilities',
		},
	},
};

export default config;
`;
}
