const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production';

    // configure plugins
    const compressionPlugin = new CompressionPlugin({
        test: /\.(js|(s*)css)$/
    });
    const eslintPlugin = new ESLintPlugin();
    const extractCssPlugin = new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
    });
    const htmlPlugin = new HtmlWebPackPlugin({
        inject: true,
        template: './src/index.html',
        filename: 'index.html'
    });

    // populate array
    let pluginArray = [eslintPlugin, extractCssPlugin, htmlPlugin];
    if (!devMode) { pluginArray.push(compressionPlugin); }

    // return webpack config object
    return {
        devServer: {
            compress: true,
            historyApiFallback: true,
            host: 'localhost',
            hot: true,
            stats: {
                all: 'normal',
                colors: true
            }
        },
        devtool: devMode ? 'source-map' : 'eval',
        entry: './src/index.js',
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false
                }),
                new CssMinimizerPlugin()
            ]
        },
        output: {
            filename: 'main.[contenthash].js',
            // cleaning plugin removes this folder by default
            path: path.resolve(__dirname, 'dist/'),
            publicPath: '/'
        },
        performance: {
            hints: false
        },
        plugins: pluginArray,
        module: {
            rules: [{
                test: /\.js$/,
                enforce: 'pre',
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/react'],
                        minified: true,
                        comments: false,
                        compact: true
                    }
                }]
            }, {
                test: /\.(s*)css$/,
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: devMode
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: devMode,
                        postcssOptions: {
                            plugins: ['autoprefixer']
                        }
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: devMode
                    }
                }]
            }, {
                test: /\.(gif|png|jpe?g|svg|ico)$/i,
                include: path.resolve(__dirname, 'src/img/'),
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            }, {
                test: /\.(woff(2)?|ttf|eot|svg)$/i,
                include: path.resolve(__dirname, 'src/fonts/'),
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }, {
                test: /\.html$/,
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'html-loader'
                }]
            }]
        }
    };
};
