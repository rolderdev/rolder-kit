/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')

//const name = 'project-template'
const version = pJson.version
const baseDir = '/Users/decard/Library/Application Support/Noodl/projects/'
const projectDir = '833bf80e-4dae-4202-9b4a-3b20ae0e6c4d'
//var outputPath = path.resolve(__dirname, baseDir + projectDir + '/noodl_modules/' + name + '_v' + version)
var outputPath = path.resolve(__dirname, `../dist/projectTemplate/${pJson.name}_v${version}`)

module.exports = {
	context: __dirname,
	watch: true,
	entry: {
		InitLoader: './InitLoader/InitLoader.jsx'
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
