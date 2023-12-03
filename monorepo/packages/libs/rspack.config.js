/**
 * @type {import('@rspack/cli').Configuration}
 */
const rspack = require('@rspack/core');
const manifestPlugin = require('rspack-manifest-plugin').WebpackManifestPlugin

var path = require('path')
const pJson = require('./package.json')
var outputPath = path.resolve(__dirname, `../../../build/${pJson.name}-v${pJson.version}`)

module.exports = {
	context: __dirname,
	watch: true,
	entry: { [pJson.name]: `./${pJson.name}` },
	output: {
		path: outputPath,
		filename: '[contenthash].js',
		clean: true,
	},
	plugins: [
		new manifestPlugin({
			writeToFileEmit: true,
			generate(_, files) {
				return { main: files[0].path.replace('auto/', '') }
			}
		}),
	],
}
