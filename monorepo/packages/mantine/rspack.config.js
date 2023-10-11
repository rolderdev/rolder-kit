/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')
const baseDir = '/Users/decard/Library/Application Support/Noodl/projects/'

// Smart clean
const projectDir = 'c09055b1-4710-4c0c-9ef3-6fc6c8446046'
// Rasko
//const projectDir = '927b35ec-cd3b-431a-ae83-d1525db09bb9'
var outputPath = path.resolve(__dirname, `${baseDir + projectDir}/noodl_modules/${pJson.name}-v${pJson.version}`)

module.exports = {
	context: __dirname,
	watch: true,
	entry: { [pJson.name]: `./${pJson.name}` },
	output: { path: outputPath, clean: true },
	builtins: { copy: { patterns: [{ from: './manifest.json' }] } },
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		'@noodl/noodl-sdk': 'Noodl',
		"dayjs": "window.R.libs.dayjs",
		"just-safe-get": "window.R.libs.just.get"
	},
}
