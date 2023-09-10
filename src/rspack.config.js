/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')

const name = 'rolder-kit'
const version = pJson.version
const baseDir = '/Users/decard/Library/Application Support/Noodl/projects/'
// Smart clean
const projectDir = 'c09055b1-4710-4c0c-9ef3-6fc6c8446046'
// Rasko
//const projectDir = '927b35ec-cd3b-431a-ae83-d1525db09bb9'
var outputPath = path.resolve(__dirname, baseDir + projectDir + '/noodl_modules/' + name + '_v' + version)
//var outputPath = path.resolve(__dirname, `../dist/rolder-kit_v${version}`)

module.exports = {
	context: __dirname,
	watch: true,
	entry: {
		main: './main/main.ts'
	},
	output: {
		path: outputPath,
		clean: true
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM'
	},
	builtins: {
		copy: {
			patterns: [
				{
					from: './manifest.json',
				},
			],
		},
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: 'asset'
			}
		]
	}
}
