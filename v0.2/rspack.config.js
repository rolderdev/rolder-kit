/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')

const name = 'rolder-kit'
const version = pJson.version
const baseDir = '/Users/decard/Library/Application Support/Noodl/projects/'
const projectDir = 'f49f7913-f59d-465d-9f42-701b2c83a4f5'
var outputPath = path.resolve(__dirname, baseDir + projectDir + '/noodl_modules/' + name + '_v' + version)
//var outputPath = path.resolve(__dirname, `../dist/v${version}`)

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
