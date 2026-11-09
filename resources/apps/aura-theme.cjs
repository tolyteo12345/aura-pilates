// Aura Studio Pilates & Wellness — single source of brand tokens for both SvelteKit apps
// (admin + member). Documented in docs/design-system.md; do not change palette values
// without design approval.
//
// Official palette → Skeleton theme mapping:
//   Primary        #43271F  primary-500
//   Primary Hover  #745044  primary-400
//   Secondary      #D8C4B2  secondary-500 / surface-300
//   Background     #F5F0E8  surface-50   (Skeleton paints <body> with surface-50)
//   Surface        #FAF8F4  surface-100  (Skeleton paints .card / .table with surface-100)
//   Text           #43271F  --theme-font-color-base
//   Muted          #82776E  surface-500 / tertiary-500
// surface-50 is intentionally a touch darker than surface-100 so Skeleton's built-in
// roles (body vs card) land on Background vs Surface without overriding its components.
// success / warning / error are the functional colours of the previous "wintry" theme, unchanged.

/** @type {import('@skeletonlabs/tw-plugin').CustomThemeConfig} */
const auraTheme = {
	name: 'aura',
	properties: {
		'--theme-font-family-base': "'DM Sans', ui-sans-serif, system-ui, sans-serif",
		'--theme-font-family-heading': "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
		'--theme-font-color-base': '67 39 31',
		'--theme-font-color-dark': '250 248 244',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '12px',
		'--theme-border-base': '1px',
		'--on-primary': '255 255 255',
		'--on-secondary': '67 39 31',
		'--on-tertiary': '255 255 255',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// primary — #43271F, 400 = Primary Hover #745044
		'--color-primary-50': '237 231 226',
		'--color-primary-100': '217 206 200',
		'--color-primary-200': '190 172 165',
		'--color-primary-300': '156 130 121',
		'--color-primary-400': '116 80 68',
		'--color-primary-500': '67 39 31',
		'--color-primary-600': '57 33 26',
		'--color-primary-700': '47 27 22',
		'--color-primary-800': '37 21 17',
		'--color-primary-900': '27 16 12',
		// secondary — #D8C4B2
		'--color-secondary-50': '251 249 247',
		'--color-secondary-100': '247 243 240',
		'--color-secondary-200': '239 231 224',
		'--color-secondary-300': '232 220 209',
		'--color-secondary-400': '224 208 193',
		'--color-secondary-500': '216 196 178',
		'--color-secondary-600': '184 167 151',
		'--color-secondary-700': '151 137 125',
		'--color-secondary-800': '119 108 98',
		'--color-secondary-900': '86 78 71',
		// tertiary — Muted #82776E
		'--color-tertiary-50': '243 241 241',
		'--color-tertiary-100': '230 228 226',
		'--color-tertiary-200': '205 201 197',
		'--color-tertiary-300': '180 173 168',
		'--color-tertiary-400': '155 146 139',
		'--color-tertiary-500': '130 119 110',
		'--color-tertiary-600': '111 101 94',
		'--color-tertiary-700': '91 83 77',
		'--color-tertiary-800': '72 65 61',
		'--color-tertiary-900': '52 48 44',
		// success / warning / error — functional, kept from "wintry"
		'--color-success-50': '237 247 220',
		'--color-success-100': '230 245 208',
		'--color-success-200': '224 242 197',
		'--color-success-300': '206 235 162',
		'--color-success-400': '169 219 92',
		'--color-success-500': '132 204 22',
		'--color-success-600': '119 184 20',
		'--color-success-700': '99 153 17',
		'--color-success-800': '79 122 13',
		'--color-success-900': '65 100 11',
		'--color-warning-50': '252 244 218',
		'--color-warning-100': '251 240 206',
		'--color-warning-200': '250 236 193',
		'--color-warning-300': '247 225 156',
		'--color-warning-400': '240 202 82',
		'--color-warning-500': '234 179 8',
		'--color-warning-600': '211 161 7',
		'--color-warning-700': '176 134 6',
		'--color-warning-800': '140 107 5',
		'--color-warning-900': '115 88 4',
		'--color-error-50': '249 221 234',
		'--color-error-100': '246 209 228',
		'--color-error-200': '244 198 221',
		'--color-error-300': '238 163 200',
		'--color-error-400': '225 94 159',
		'--color-error-500': '212 25 118',
		'--color-error-600': '191 23 106',
		'--color-error-700': '159 19 89',
		'--color-error-800': '127 15 71',
		'--color-error-900': '104 12 58',
		// surface — warm neutrals (see mapping above); 400 keeps ≥3:1 for input borders on white
		'--color-surface-50': '245 240 232',
		'--color-surface-100': '250 248 244',
		'--color-surface-200': '233 222 210',
		'--color-surface-300': '216 196 178',
		'--color-surface-400': '160 143 128',
		'--color-surface-500': '130 119 110',
		'--color-surface-600': '111 95 86',
		'--color-surface-700': '92 71 63',
		'--color-surface-800': '76 51 43',
		'--color-surface-900': '47 27 22'
	}
};

const rgb = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

// Semantic aliases merged into each app's `theme.extend`. They sit on top of Skeleton's
// numbered scales (primary-500 …), so both `bg-primary` and `bg-primary-500` keep working.
const auraExtend = {
	colors: {
		primary: { DEFAULT: rgb('primary-500'), hover: rgb('primary-400') },
		secondary: { DEFAULT: rgb('secondary-500') },
		background: rgb('surface-50'),
		surface: { DEFAULT: rgb('surface-100') },
		muted: rgb('surface-500')
	},
	borderColor: {
		DEFAULT: rgb('surface-300')
	},
	fontFamily: {
		heading: 'var(--theme-font-family-heading)',
		body: 'var(--theme-font-family-base)'
	}
};

module.exports = { auraTheme, auraExtend };
