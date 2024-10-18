/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path')
const pJson = require('./package.json')
const rspackBaseConfig = require('@shared/rspack-config-v0.1.0')

const nodeName = pJson.name
var outputBuildPath = path.resolve(__dirname, `../../../build/${nodeName}`)

module.exports = (env) => {
	const config = rspackBaseConfig(nodeName, __dirname, outputBuildPath, env.developer, env.project)

	// postcss
	config.experiments = { css: true }
	config.module.rules.push({
		test: /\.css$/,
		use: ['postcss-loader'],
		type: 'css/auto',
	})
	config.module.parser = { 'css/auto': { namedExports: false } }

	return config
}
