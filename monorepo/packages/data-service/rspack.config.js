/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')
const rKitPjson = require('../../package.json')

const baseDir = '/Users/decard/Library/Application Support/Noodl/projects/'
// Smart clean
const projectDir = 'c09055b1-4710-4c0c-9ef3-6fc6c8446046'
// Rasko
//const projectDir = '927b35ec-cd3b-431a-ae83-d1525db09bb9'
// Temp
//const projectDir = 'c0f27b62-61f0-4c23-be5c-0b97571a45d2'
var outputPath = path.resolve(__dirname, `${baseDir + projectDir}/noodl_modules/${rKitPjson.name}-v${rKitPjson.version}_${pJson.name}-v${pJson.version}`)
//var outputPath = path.resolve(__dirname, `../dist/rolder-kit_v${version}`)

module.exports = {
	context: __dirname,
	watch: true,
	entry: {
		dataService: './v0.2.0/dataService.ts'
	},
	output: {
		path: outputPath,
		clean: true
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
}
