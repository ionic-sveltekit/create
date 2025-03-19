import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// determine which package manager is running
export function whichPMRuns() {
	const userAgent = process.env.npm_config_user_agent;
	if (!userAgent) {
		return undefined;
	}
	const pmSpec = userAgent.split(' ')[0] || '';
	const separatorPos = pmSpec.lastIndexOf('/');
	const name = pmSpec?.substring(0, separatorPos);
	return {
		name: name === 'npminstall' ? 'cnpm' : name,
		version: pmSpec?.substring(separatorPos + 1)
	};
}

/** @param {string} dir */
export function mkdirp(dir) {
	try {
		fs.mkdirSync(dir, { recursive: true });
	} catch (e) {
		if (e.code === 'EEXIST') return;
		throw e;
	}
}

export function dist(pathToFind) {
	let pathAdjust = '';
	let base = fileURLToPath(new URL(`./`, import.meta.url).href);
	if (base.endsWith('shared', base.length - 1)) {
		pathAdjust = '../';
	}

	const res = path.resolve(base, pathAdjust, pathToFind);
	// console.log('Requested:', pathToFind);
	// console.log('resolved:', res);
	return res;
}

export function getHelpText() {
	// Must use spaces for adjustments as output can get very wonky with tab output
	// Why not array of arrays, TBH it's more readable in source like this and easy to edit with column selection etc.
	// But the advantage would be that padEnd could be adjusted to the console.width... will wait for feedback.
	return `
Option              Short   Default   Values                      Description
--help              -h                                                  This help screen
--quiet             -q                                                  Quiet mode - see below
--verbose           -v                                                  Show shell output for troubleshooting
--name              -n      new-app         string, no spaces           Name of the directory for the project
--path              -p      ''              relative or absolute path   Location to install, name is appended
--ionicons          -i      true            true|false                  Include Ionic icon library Ionicons
--capacitor         -c      false           true|false                  Install dependencies for Capacitor
--types             -t      typescript      typescript|checkjs          Typescipt or Javascript with JSDoc
--eslint                    true            true|false                  Whether ESLint is added
--prettier                  false           true|false                  Whether Prettier is added
--playwright                false           true|false                  Whether Playwright is added
--vitest                    false           true|false                  Whether Vitest is added

Quiet mode is for automated installs, for testing, or CI/CD. It will take all of the default values in the
Default column, but you can provide any other flags to override as you see fit. When not in quiet mode, any
arguments that have not been passed in will be prompted for.
`;
}

export function getIonicVariables() {
	return `/* Ionic Variables and Theming. For more info, please see:
  http://ionicframework.com/docs/theming/ */

/** Ionic CSS Variables **/
:root {
	/** primary **/
	--ion-color-primary: #3880ff;
	--ion-color-primary-rgb: 56, 128, 255;
	--ion-color-primary-contrast: #ffffff;
	--ion-color-primary-contrast-rgb: 255, 255, 255;
	--ion-color-primary-shade: #3171e0;
	--ion-color-primary-tint: #4c8dff;

	/** secondary **/
	--ion-color-secondary: #3dc2ff;
	--ion-color-secondary-rgb: 61, 194, 255;
	--ion-color-secondary-contrast: #ffffff;
	--ion-color-secondary-contrast-rgb: 255, 255, 255;
	--ion-color-secondary-shade: #36abe0;
	--ion-color-secondary-tint: #50c8ff;

	/** tertiary **/
	--ion-color-tertiary: #5260ff;
	--ion-color-tertiary-rgb: 82, 96, 255;
	--ion-color-tertiary-contrast: #ffffff;
	--ion-color-tertiary-contrast-rgb: 255, 255, 255;
	--ion-color-tertiary-shade: #4854e0;
	--ion-color-tertiary-tint: #6370ff;

	/** success **/
	--ion-color-success: #2dd36f;
	--ion-color-success-rgb: 45, 211, 111;
	--ion-color-success-contrast: #ffffff;
	--ion-color-success-contrast-rgb: 255, 255, 255;
	--ion-color-success-shade: #28ba62;
	--ion-color-success-tint: #42d77d;

	/** warning **/
	--ion-color-warning: #ffc409;
	--ion-color-warning-rgb: 255, 196, 9;
	--ion-color-warning-contrast: #000000;
	--ion-color-warning-contrast-rgb: 0, 0, 0;
	--ion-color-warning-shade: #e0ac08;
	--ion-color-warning-tint: #ffca22;

	/** danger **/
	--ion-color-danger: #eb445a;
	--ion-color-danger-rgb: 235, 68, 90;
	--ion-color-danger-contrast: #ffffff;
	--ion-color-danger-contrast-rgb: 255, 255, 255;
	--ion-color-danger-shade: #cf3c4f;
	--ion-color-danger-tint: #ed576b;

	/** dark **/
	--ion-color-dark: #222428;
	--ion-color-dark-rgb: 34, 36, 40;
	--ion-color-dark-contrast: #ffffff;
	--ion-color-dark-contrast-rgb: 255, 255, 255;
	--ion-color-dark-shade: #1e2023;
	--ion-color-dark-tint: #383a3e;

	/** medium **/
	--ion-color-medium: #92949c;
	--ion-color-medium-rgb: 146, 148, 156;
	--ion-color-medium-contrast: #ffffff;
	--ion-color-medium-contrast-rgb: 255, 255, 255;
	--ion-color-medium-shade: #808289;
	--ion-color-medium-tint: #9d9fa6;

	/** light **/
	--ion-color-light: #f4f5f8;
	--ion-color-light-rgb: 244, 245, 248;
	--ion-color-light-contrast: #000000;
	--ion-color-light-contrast-rgb: 0, 0, 0;
	--ion-color-light-shade: #d7d8da;
	--ion-color-light-tint: #f5f6f9;
}

@media (prefers-color-scheme: dark) {
	/*
     * Dark Colors
     * -------------------------------------------
     */

	body {
		--ion-color-primary: #428cff;
		--ion-color-primary-rgb: 66, 140, 255;
		--ion-color-primary-contrast: #ffffff;
		--ion-color-primary-contrast-rgb: 255, 255, 255;
		--ion-color-primary-shade: #3a7be0;
		--ion-color-primary-tint: #5598ff;

		--ion-color-secondary: #50c8ff;
		--ion-color-secondary-rgb: 80, 200, 255;
		--ion-color-secondary-contrast: #ffffff;
		--ion-color-secondary-contrast-rgb: 255, 255, 255;
		--ion-color-secondary-shade: #46b0e0;
		--ion-color-secondary-tint: #62ceff;

		--ion-color-tertiary: #6a64ff;
		--ion-color-tertiary-rgb: 106, 100, 255;
		--ion-color-tertiary-contrast: #ffffff;
		--ion-color-tertiary-contrast-rgb: 255, 255, 255;
		--ion-color-tertiary-shade: #5d58e0;
		--ion-color-tertiary-tint: #7974ff;

		--ion-color-success: #2fdf75;
		--ion-color-success-rgb: 47, 223, 117;
		--ion-color-success-contrast: #000000;
		--ion-color-success-contrast-rgb: 0, 0, 0;
		--ion-color-success-shade: #29c467;
		--ion-color-success-tint: #44e283;

		--ion-color-warning: #ffd534;
		--ion-color-warning-rgb: 255, 213, 52;
		--ion-color-warning-contrast: #000000;
		--ion-color-warning-contrast-rgb: 0, 0, 0;
		--ion-color-warning-shade: #e0bb2e;
		--ion-color-warning-tint: #ffd948;

		--ion-color-danger: #ff4961;
		--ion-color-danger-rgb: 255, 73, 97;
		--ion-color-danger-contrast: #ffffff;
		--ion-color-danger-contrast-rgb: 255, 255, 255;
		--ion-color-danger-shade: #e04055;
		--ion-color-danger-tint: #ff5b71;

		--ion-color-dark: #f4f5f8;
		--ion-color-dark-rgb: 244, 245, 248;
		--ion-color-dark-contrast: #000000;
		--ion-color-dark-contrast-rgb: 0, 0, 0;
		--ion-color-dark-shade: #d7d8da;
		--ion-color-dark-tint: #f5f6f9;

		--ion-color-medium: #989aa2;
		--ion-color-medium-rgb: 152, 154, 162;
		--ion-color-medium-contrast: #000000;
		--ion-color-medium-contrast-rgb: 0, 0, 0;
		--ion-color-medium-shade: #86888f;
		--ion-color-medium-tint: #a2a4ab;

		--ion-color-light: #222428;
		--ion-color-light-rgb: 34, 36, 40;
		--ion-color-light-contrast: #ffffff;
		--ion-color-light-contrast-rgb: 255, 255, 255;
		--ion-color-light-shade: #1e2023;
		--ion-color-light-tint: #383a3e;
	}

	/*
     * iOS Dark Theme
     * -------------------------------------------
     */

	.ios body {
		--ion-background-color: #000000;
		--ion-background-color-rgb: 0, 0, 0;

		--ion-text-color: #ffffff;
		--ion-text-color-rgb: 255, 255, 255;

		--ion-color-step-50: #0d0d0d;
		--ion-color-step-100: #1a1a1a;
		--ion-color-step-150: #262626;
		--ion-color-step-200: #333333;
		--ion-color-step-250: #404040;
		--ion-color-step-300: #4d4d4d;
		--ion-color-step-350: #595959;
		--ion-color-step-400: #666666;
		--ion-color-step-450: #737373;
		--ion-color-step-500: #808080;
		--ion-color-step-550: #8c8c8c;
		--ion-color-step-600: #999999;
		--ion-color-step-650: #a6a6a6;
		--ion-color-step-700: #b3b3b3;
		--ion-color-step-750: #bfbfbf;
		--ion-color-step-800: #cccccc;
		--ion-color-step-850: #d9d9d9;
		--ion-color-step-900: #e6e6e6;
		--ion-color-step-950: #f2f2f2;

		--ion-item-background: #000000;

		--ion-card-background: #1c1c1d;
	}

	.ios ion-modal {
		--ion-background-color: var(--ion-color-step-100);
		--ion-toolbar-background: var(--ion-color-step-150);
		--ion-toolbar-border-color: var(--ion-color-step-250);
	}

	/*
     * Material Design Dark Theme
     * -------------------------------------------
     */

	.md body {
		--ion-background-color: #121212;
		--ion-background-color-rgb: 18, 18, 18;

		--ion-text-color: #ffffff;
		--ion-text-color-rgb: 255, 255, 255;

		--ion-border-color: #222222;

		--ion-color-step-50: #1e1e1e;
		--ion-color-step-100: #2a2a2a;
		--ion-color-step-150: #363636;
		--ion-color-step-200: #414141;
		--ion-color-step-250: #4d4d4d;
		--ion-color-step-300: #595959;
		--ion-color-step-350: #656565;
		--ion-color-step-400: #717171;
		--ion-color-step-450: #7d7d7d;
		--ion-color-step-500: #898989;
		--ion-color-step-550: #949494;
		--ion-color-step-600: #a0a0a0;
		--ion-color-step-650: #acacac;
		--ion-color-step-700: #b8b8b8;
		--ion-color-step-750: #c4c4c4;
		--ion-color-step-800: #d0d0d0;
		--ion-color-step-850: #dbdbdb;
		--ion-color-step-900: #e7e7e7;
		--ion-color-step-950: #f3f3f3;

		--ion-item-background: #1e1e1e;

		--ion-toolbar-background: #1f1f1f;

		--ion-tab-bar-background: #1f1f1f;

		--ion-card-background: #1e1e1e;
	}
}

/*
* Classic class selector way - assign dark md or dark ios to force dark mode
* See https://ionicframework.com/docs/theming/dark-mode
*/

body.dark {
	/* Dark mode variables go here */
	/*
     * Dark Colors
     * -------------------------------------------
     */
	--ion-color-primary: #428cff;
	--ion-color-primary-rgb: 66, 140, 255;
	--ion-color-primary-contrast: #ffffff;
	--ion-color-primary-contrast-rgb: 255, 255, 255;
	--ion-color-primary-shade: #3a7be0;
	--ion-color-primary-tint: #5598ff;

	--ion-color-secondary: #50c8ff;
	--ion-color-secondary-rgb: 80, 200, 255;
	--ion-color-secondary-contrast: #ffffff;
	--ion-color-secondary-contrast-rgb: 255, 255, 255;
	--ion-color-secondary-shade: #46b0e0;
	--ion-color-secondary-tint: #62ceff;

	--ion-color-tertiary: #6a64ff;
	--ion-color-tertiary-rgb: 106, 100, 255;
	--ion-color-tertiary-contrast: #ffffff;
	--ion-color-tertiary-contrast-rgb: 255, 255, 255;
	--ion-color-tertiary-shade: #5d58e0;
	--ion-color-tertiary-tint: #7974ff;

	--ion-color-success: #2fdf75;
	--ion-color-success-rgb: 47, 223, 117;
	--ion-color-success-contrast: #000000;
	--ion-color-success-contrast-rgb: 0, 0, 0;
	--ion-color-success-shade: #29c467;
	--ion-color-success-tint: #44e283;

	--ion-color-warning: #ffd534;
	--ion-color-warning-rgb: 255, 213, 52;
	--ion-color-warning-contrast: #000000;
	--ion-color-warning-contrast-rgb: 0, 0, 0;
	--ion-color-warning-shade: #e0bb2e;
	--ion-color-warning-tint: #ffd948;

	--ion-color-danger: #ff4961;
	--ion-color-danger-rgb: 255, 73, 97;
	--ion-color-danger-contrast: #ffffff;
	--ion-color-danger-contrast-rgb: 255, 255, 255;
	--ion-color-danger-shade: #e04055;
	--ion-color-danger-tint: #ff5b71;

	--ion-color-dark: #f4f5f8;
	--ion-color-dark-rgb: 244, 245, 248;
	--ion-color-dark-contrast: #000000;
	--ion-color-dark-contrast-rgb: 0, 0, 0;
	--ion-color-dark-shade: #d7d8da;
	--ion-color-dark-tint: #f5f6f9;

	--ion-color-medium: #989aa2;
	--ion-color-medium-rgb: 152, 154, 162;
	--ion-color-medium-contrast: #000000;
	--ion-color-medium-contrast-rgb: 0, 0, 0;
	--ion-color-medium-shade: #86888f;
	--ion-color-medium-tint: #a2a4ab;

	--ion-color-light: #222428;
	--ion-color-light-rgb: 34, 36, 40;
	--ion-color-light-contrast: #ffffff;
	--ion-color-light-contrast-rgb: 255, 255, 255;
	--ion-color-light-shade: #1e2023;
	--ion-color-light-tint: #383a3e;
}

body.dark.ios {
	--ion-background-color: #000000;
	--ion-background-color-rgb: 0, 0, 0;

	--ion-text-color: #ffffff;
	--ion-text-color-rgb: 255, 255, 255;

	--ion-color-step-50: #0d0d0d;
	--ion-color-step-100: #1a1a1a;
	--ion-color-step-150: #262626;
	--ion-color-step-200: #333333;
	--ion-color-step-250: #404040;
	--ion-color-step-300: #4d4d4d;
	--ion-color-step-350: #595959;
	--ion-color-step-400: #666666;
	--ion-color-step-450: #737373;
	--ion-color-step-500: #808080;
	--ion-color-step-550: #8c8c8c;
	--ion-color-step-600: #999999;
	--ion-color-step-650: #a6a6a6;
	--ion-color-step-700: #b3b3b3;
	--ion-color-step-750: #bfbfbf;
	--ion-color-step-800: #cccccc;
	--ion-color-step-850: #d9d9d9;
	--ion-color-step-900: #e6e6e6;
	--ion-color-step-950: #f2f2f2;

	--ion-item-background: #000000;

	--ion-card-background: #1c1c1d;
}

body.dark.ios ion-modal {
	--ion-background-color: var(--ion-color-step-100);
	--ion-toolbar-background: var(--ion-color-step-150);
	--ion-toolbar-border-color: var(--ion-color-step-250);
}

body.dark.md {
	--ion-background-color: #121212;
	--ion-background-color-rgb: 18, 18, 18;

	--ion-text-color: #ffffff;
	--ion-text-color-rgb: 255, 255, 255;

	--ion-border-color: #222222;

	--ion-color-step-50: #1e1e1e;
	--ion-color-step-100: #2a2a2a;
	--ion-color-step-150: #363636;
	--ion-color-step-200: #414141;
	--ion-color-step-250: #4d4d4d;
	--ion-color-step-300: #595959;
	--ion-color-step-350: #656565;
	--ion-color-step-400: #717171;
	--ion-color-step-450: #7d7d7d;
	--ion-color-step-500: #898989;
	--ion-color-step-550: #949494;
	--ion-color-step-600: #a0a0a0;
	--ion-color-step-650: #acacac;
	--ion-color-step-700: #b8b8b8;
	--ion-color-step-750: #c4c4c4;
	--ion-color-step-800: #d0d0d0;
	--ion-color-step-850: #dbdbdb;
	--ion-color-step-900: #e7e7e7;
	--ion-color-step-950: #f3f3f3;

	--ion-item-background: #1e1e1e;

	--ion-toolbar-background: #1f1f1f;

	--ion-tab-bar-background: #1f1f1f;

	--ion-card-background: #1e1e1e;
}
`;
}

export function getDemoIonicApp() {
	return `
<ion-card>
	<ion-card-header>
		<ion-card-subtitle>Great success!!</ion-card-subtitle>

		<ion-card-title>Welcome to your app!</ion-card-title>
	</ion-card-header>

	<ion-card-content>
		Thank you for using this starter. Click buttons below to open these guides (will
		open in new window). Don't forget to open DevTools to see this app in mobile mode. Happy coding!!!
	</ion-card-content>

	<ion-item>
		<ion-label>Visit Ionic Showcase app with sourceviewer</ion-label>

		<ion-button href="https://ionic-svelte.firebaseapp.com/" target="_new" fill="outline" slot="end">View</ion-button>
	</ion-item>

	<ion-item>
		<ion-label>Visit Ionic component docs</ion-label>

		<ion-button
			href="https://ionicframework.com/docs/components"
			target="_new"
			fill="outline"
			slot="end"
		>View</ion-button>
	</ion-item>

	<ion-item>
		<ion-label>Visit Svelte Kit docs</ion-label>

		<ion-button
			href="https://kit.svelte.dev/docs/introduction"
			target="_new"
			fill="outline"
			slot="end"
		>View</ion-button>
	</ion-item>
	<ion-item>
		<ion-label>Visit Svelte docs</ion-label>

		<ion-button href="https://svelte.dev/docs" target="_new" fill="outline" slot="end">View</ion-button>
	</ion-item>
</ion-card>
	`;
}

export function parseCapacitorConfig(config) {
	const { appId, appName, ip } = config;

	return `
import { CapacitorConfig } from '@capacitor/cli';

const appId = '${appId}';
const appName = '${appName}';
const server = process.argv.includes('-hmr') ? {
  'url': 'http://${ip}:5173',   // always have http:// in url
  'cleartext': true
} : {};
const webDir = 'build';

const config: CapacitorConfig = {
  appId,
  appName,
  webDir,
  server
};

if (process.argv.includes('-hmr')) console.log('WARNING: running capacitor with livereload config', config);

export default config;
  `;
}

export function parseLayout(useTypescript) {
  return `<script${useTypescript ? ' lang="ts"' : ''}>
	import { setupIonicBase } from 'ionic-svelte';

	/* Call Ionic's setup routine. */
	setupIonicBase();

	/* Import all components. (You can selectively import components instead; see below.) */
	import 'ionic-svelte/components/all';

	/* Theme variables */
	import '../theme/variables.css';

	/*
		This part - import 'ionic-svelte/components/all'; - loads all components at once. Importing this way adds 80 components and >800kb (uncompressed) to your bundle.

		Alternately, you can choose to import only the components you want to use.

		Doing selective imports in this file is recommended because you only have to do such imports once.
		If you like to code-split differently, you are free to import wherever you like.

		Example: If you replace the line import 'ionic-svelte/components/all'; with the imports below, the resulting bundle becomes much smaller.

		import 'ionic-svelte/components/ion-app';
		import 'ionic-svelte/components/ion-card';
		import 'ionic-svelte/components/ion-card-title';
		import 'ionic-svelte/components/ion-card-subtitle';
		import 'ionic-svelte/components/ion-card-header';
		import 'ionic-svelte/components/ion-card-content';
		import 'ionic-svelte/components/ion-button';
		import 'ionic-svelte/components/ion-item';
		import 'ionic-svelte/components/ion-label';

		To see the full list of possible imports, click ionic-svelte-components-all-import above.

		When you decide to do selective imports, ion-app must be imported in this file like this:

	    import 'ionic-svelte/components/ion-app';

		Report issues here - https://github.com/Tommertom/svelte-ionic-npm/issues
		Want to know more about what is happening? Follow me on X! - https://x.com/Tommertomm
		Discord channel on Ionic server - https://discordapp.com/channels/520266681499779082/1049388501629681675
	*/
</script>

<ion-app>
	<slot />
</ion-app>
`;
}

export function parseTabsComponent(useTypescript) {
  return `<script${useTypescript ? ' lang="ts"' : ''} module>
  import type { Snippet } from "svelte";

  import { onNavigate, goto } from "$app/navigation";

  import { page } from "$app/state";

  import { HEK, preventDefault } from "$utilities/helper";

  type BaseTab = {
    link: string;
    descendentsActiveStatus?: boolean;
    matchPath?: RegExp;
  };

  interface TabOptionalTitle extends BaseTab {
    title?: string;
    icon: string;
  }

  interface TabOptionalIcon extends BaseTab {
    title: string;
    icon?: string;
  }

  export type Tab = TabOptionalTitle | TabOptionalIcon;

  type Props = {
    content: Snippet;
    tabs: Tab[];
    tabPosition?: "top" | "bottom";
    viewTransition?: boolean;
  };
</script>

<script${useTypescript ? ' lang="ts"' : ''}>
  let { content, tabs, tabPosition, viewTransition = true }: Props = $props();

  onNavigate((navigation) => {
    if (!(viewTransition && document.startViewTransition)) {
      return;
    }

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();

        await navigation.complete;
      });
    });
  });

  function isSelected(tab: Tab, pathname: string): boolean {
    if (tab.matchPath) {
      return tab.matchPath.test(pathname);
    }

    return tab.descendentsActiveStatus === true
      ? pathname.startsWith(tab.link)
      : tab.link === pathname;
  }
</script>

<ion-tabs>
  <main class="tab-content">
    {@render content?.()}
  </main>

  <ion-tab-bar slot={tabPosition ?? "bottom"}>
    {#each tabs as tab}
      <ion-tab-button
        selected={isSelected(tab, page.url.pathname)}
        onclick={preventDefault(() => goto(tab.link))}
        onkeydown={HEK(preventDefault(() => goto(tab.link)))}
        role="tab"
        tabindex="0"
      >
        {#if tab.icon}
          <ion-icon icon={tab.icon}></ion-icon>
        {/if}

        {#if tab.title}
          {tab.title}
        {/if}
      </ion-tab-button>
    {/each}
  </ion-tab-bar>
</ion-tabs>

<style>
  .tab-content {
    max-width: 600px;
    justify-self: center;
  }

  ion-tab-bar {
    view-transition-name: tab-bar;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(30px);
    }
  }

  @keyframes slide-to-left {
    to {
      transform: translateX(-30px);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    :root::view-transition-old(root) {
      animation:
        90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
    }

    :root::view-transition-new(root) {
      animation:
        210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
    }
  }
</style>
`;
}

export function getHelperUtility() {
  return `export function handleEnterKey(fn) {
	return function(event) {
		if (event.key === 'Enter') {
			fn.call(this, event);
		}
	};
}

export const HEK = handleEnterKey;

export function preventDefault(fn) {
	return function(event) {
		event.preventDefault();

		fn.call(this, event);
	};
}
`;
}

export function parsePage1(useTypescript) {
  return `<script${useTypescript ? ' lang="ts"' : ''} module>
  import { HEK } from "$utilities/helper";

  import img from "$images/home.png";
</script>

<script${useTypescript ? ' lang="ts"' : ''}>
  let count = $state(0);

  const verb = $derived("click" + (count === 1 ? "" : "s"));

  function onclick() {
    count++;
  }
</script>

<ion-card>
  <img
    src={img}
    alt="illustrated house"
    style="--rotation: {count * 22.5}deg;"
  />

  <ion-card-header>
    <ion-card-title>Homepage</ion-card-title>

    <ion-card-subtitle>Welcome</ion-card-subtitle>
  </ion-card-header>

  <ion-card-content>
    <ion-button {onclick} onkeydown={HEK(onclick)} role="button" tabindex="0">
      {count}
      {verb}
    </ion-button>
  </ion-card-content>
</ion-card>

<style>
  img {
    transform: rotate(var(--rotation));
  }
</style>
`;
}

export function parsePage2(useTypescript) {
  return `<script${useTypescript ? ' lang="ts"' : ''} module>
  import img from "$images/planets.jpg";
</script>

<script${useTypescript ? ' lang="ts"' : ''}>
  let count = $state(8);

  const planets = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ];

  function onionInput(event) {
    count = (event.detail?.value as number) ?? 8;
  }
</script>

<ion-card>
  <img src={img} alt="planets of our solar system" />

  <ion-card-header>
    <ion-card-title>Planets</ion-card-title>

    <ion-card-subtitle>{count} Planets</ion-card-subtitle>
  </ion-card-header>

  <ion-card-content>
    <ion-range
      min={4}
      max={12}
      value={count}
      aria-label="planet count"
      {onionInput}
    ></ion-range>

    <ol>
      {#snippet planetLink(planet)}
        <a href="/planets/{planet.toLowerCase()}">{planet}</a>
      {/snippet}

      {#each Array(count) as _, index}
        {@const planet = planets[index] ?? "[Undiscovered]"}

        <li>
          {#if planet === "Earth"}
            {@render planetLink(planet)}
          {:else}
            {planet}
          {/if}
        </li>
      {/each}
    </ol>
  </ion-card-content>
</ion-card>

<style></style>
`;
}

export function parsePage3(useTypescript) {
  return `<script${useTypescript ? ' lang="ts"' : ''} module>
  import img from "$images/earth.jpg";
</script>

<script${useTypescript ? ' lang="ts"' : ''}>
  const elements = ["oxygen", "silicon", "aluminum", "iron", "magnesium"];

  function onionItemReorder(event) {
    event?.detail?.complete();
  }
</script>

<ion-card>
  <img src={img} alt="Earth from space" />

  <ion-card-header>
    <ion-card-title>Earth</ion-card-title>

    <ion-card-subtitle>3rd Rock from the Sun</ion-card-subtitle>
  </ion-card-header>

  <ion-card-content>
    <ion-list>
      <ion-list-header>
        <ion-label>Most common elements</ion-label>
      </ion-list-header>

      <ion-reorder-group disabled={false} {onionItemReorder}>
        {#each elements as element, index}
          <ion-item>
            <ion-label>{element}</ion-label>

            <ion-reorder></ion-reorder>
          </ion-item>
        {/each}
      </ion-reorder-group>
    </ion-list>
  </ion-card-content>
</ion-card>
`;
}
