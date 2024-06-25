/**
 * @type {import('@rspack/cli').Configuration}
 */
const manifestPlugin = require('rspack-manifest-plugin').WebpackManifestPlugin;
var path = require('path');
const projectsJson = require('./projects.json');

module.exports = function (nodeName, context, outputBuildPath, noodlProject) {
	var outputPath = outputBuildPath;
	if (noodlProject) {
		const noodlProjectConf = projectsJson.projects[noodlProject];
		if (noodlProjectConf?.projectDir && noodlProjectConf?.rolderKit?.includes(nodeName))
			outputPath = path.resolve(
				__dirname,
				`${projectsJson.noodlProjectsDir}/${noodlProjectConf.projectDir}/noodl_modules/${nodeName}`
			);
	}

	return {
		context,
		performance: { hints: false },
		entry: { [nodeName]: `./src/${nodeName}.ts` },
		resolve: {
			extensions: ['...', '.tsx', '.ts']
		},
		output: {
			path: outputPath,
			filename: '[name].js',
			chunkFilename: '[contenthash].js',
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
					/** @type {import('@rspack/core').SwcLoaderOptions} */
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
					/** @type {import('@rspack/core').SwcLoaderOptions} */
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
					/** @type {import('@rspack/core').SwcLoaderOptions} */
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
