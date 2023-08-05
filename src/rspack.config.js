/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')

const name = 'rolder-kit'
const version = pJson.version
const baseDir = '/Users/decard/Library/Application Support/Noodl/projects/'
const projectDir = '3a8dc756-5891-4ec3-b88a-04fc6067392c'
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
