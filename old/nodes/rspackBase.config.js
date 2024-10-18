/**
 * @type {import('@rspack/cli').Configuration}
 */
const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin')
const manifestPlugin = require('rspack-manifest-plugin').WebpackManifestPlugin
var path = require('path')

module.exports = (nodeName, context, outputBuildPath, developer, project) => {
	var outputPath = outputBuildPath
	if (developer && project) {
		const projectsJson = require(`../../developers/${developer}.json`)
		const projectConf = projectsJson[project]
		if (projectConf?.rolderKit?.includes(nodeName))
			outputPath = path.resolve(__dirname, `${projectConf.projectDir}/noodl_modules/${nodeName}`)
	}

	return {
		context,
		performance: { hints: false },
		entry: { [nodeName]: `./src/${nodeName}.ts` },
		resolve: {
			extensions: ['...', '.ts', '.tsx'],
		},
		output: {
			path: outputPath,
			filename: '[name]-[contenthash].js',
			chunkFilename: '[name]-[contenthash].js',
			cssFilename: '[name].css',
			clean: true,
		},
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
		},
		plugins: [
			new manifestPlugin({
				writeToFileEmit: true,
				generate(_, files) {
					const file = files.find((i) => i.name === `${nodeName}.js`)
					if (file?.path) var fileName = file.path.replace('auto/', '')
					return { main: fileName }
				},
			}),
			process.env.RSDOCTOR && new RsdoctorRspackPlugin({ generateTileGraph: true }),
		].filter(Boolean),
		// Почему то минимайзер CSS наоборот увеличивает в нашем случае.
		//optimization: { minimizer: [new rspack.LightningCssMinimizerRspackPlugin()] },
		experiments: { css: true }, // С версии 1.0.0
		module: {
			parser: { 'css/auto': { namedExports: false } },
			rules: [
				{
					test: /\.ts$/,
					exclude: /[\\/]node_modules[\\/]/,
					loader: 'builtin:swc-loader',
					/** @type {import('@rspack/core').SwcLoaderOptions} */
					options: {
						jsc: {
							parser: {
								syntax: 'typescript',
							},
						},
					},
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
								tsx: true,
							},
						},
					},
				},
			],
		},
	}
}
