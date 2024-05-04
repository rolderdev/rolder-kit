/**
 * @type {import('@rspack/cli').Configuration}
 */
const rspack = require('@rspack/core');
const manifestPlugin = require('rspack-manifest-plugin').WebpackManifestPlugin;

var path = require('path');
const pJson = require('./package.json');

const nodeName = pJson.name;
const projectsJson = require('../../../projects.json');
var outputBuildPath = path.resolve(__dirname, `../../../build/${nodeName}`);

module.exports = function (env) {
	var outputPath = outputBuildPath;
	const noodlProject = env.noodlProject;
	if (noodlProject) {
		const noodlProjectConf = projectsJson.projects[noodlProject];
		if (noodlProjectConf?.projectDir && noodlProjectConf?.rolderKit?.includes(nodeName))
			outputPath = path.resolve(
				__dirname,
				`${projectsJson.noodlProjectsDir}/${noodlProjectConf.projectDir}/noodl_modules/${nodeName}`
			);
	}

	return {
		context: __dirname,
		stats: { preset: 'errors-only', timings: true },
		entry: { [pJson.name]: `./src/${nodeName}.ts` },
		resolve: {
			extensions: ['...', '.tsx', '.ts']
		},
		output: {
			path: outputPath,
			filename: '[contenthash].js',
			clean: true
		},
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM'
		},
		plugins: [
			new manifestPlugin({
				writeToFileEmit: true,
				generate(_, files) {
					const file = files.find((i) => i.name === `${nodeName}.js`);
					if (file?.path) var fileName = file.path.replace('auto/', '');
					return { main: fileName };
				}
			})
		],
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /[\\/]node_modules[\\/]/,
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'typescript'
							}
						},
						env: {
							targets: 'Chrome >= 80'
						}
					}
				},
				{
					test: /\.tsx$/,
					exclude: /[\\/]node_modules[\\/]/,
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'typescript',
								tsx: true
							}
						}
					}
				},
				{
					test: /\.jsx$/,
					exclude: /[\\/]node_modules[\\/]/,
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'ecmascript',
								jsx: true
							}
						}
					}
				}
			]
		}
	};
};
