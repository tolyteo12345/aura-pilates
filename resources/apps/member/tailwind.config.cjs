// @ts-check
const { join } = require('path');

// 1. Import the Skeleton plugin
const { skeleton } = require('@skeletonlabs/tw-plugin');
const forms = require('@tailwindcss/forms');
// Aura brand tokens shared with the admin app — see docs/design-system.md
const { auraTheme, auraExtend } = require('../aura-theme.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: { ...auraExtend }
	},
	plugins: [
		skeleton({
			themes: { preset: ['skeleton', 'modern', 'crimson', 'wintry'], custom: [auraTheme] }
		}),
		forms
	]
};
