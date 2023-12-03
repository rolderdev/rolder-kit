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
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM'
	},
	plugins: [
		new manifestPlugin({
			writeToFileEmit: true,
			generate(_, files) {
				return { main: files[0].path.replace('auto/', '') }
			}
		}),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'builtin:swc-loader',
				options: {
					jsc: {
						parser: {
							syntax: "typescript"
						}
					}
				},
				type: 'javascript/auto',
			},
			{
				test: /\.tsx$/,
				exclude: /node_modules/,
				loader: 'builtin:swc-loader',
				options: {
					jsc: {
						parser: {
							syntax: "typescript",
							tsx: true
						}
					}
				},
				type: 'javascript/auto',
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'builtin:swc-loader',
				options: {
					jsc: {
						parser: {
							syntax: "ecmascript",
							jsx: true
						}
					}
				}
			},
		]
	}
}