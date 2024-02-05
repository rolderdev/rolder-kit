/**
 * @type {import('@rspack/cli').Configuration}
 */
const rspack = require('@rspack/core');
const manifestPlugin = require('rspack-manifest-plugin').WebpackManifestPlugin

var path = require('path')
const pJson = require('./package.json')
var outputPath = path.resolve(__dirname, `./dist`)

module.exports = {
    context: __dirname,
    stats: { preset: 'errors-only', timings: true },
    entry: { [pJson.name]: `./dataOld.ts` },
    resolve: {
        extensions: ['...', '.tsx', '.ts']
    },
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
        })
    ],
    experiments: {
        rspackFuture: {
            newTreeshaking: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /[\\/]node_modules[\\/]/,
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript"
                        }
                    },
                    env: {
                        targets: "Chrome >= 80"
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
                            syntax: "typescript",
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
                            syntax: "ecmascript",
                            jsx: true
                        },
                    }
                }
            },
        ]
    }
}
