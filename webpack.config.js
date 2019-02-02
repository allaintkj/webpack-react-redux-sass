const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
	const devMode = argv.mode !== 'production';

	// configure plugins
	const cleanWebpackPlugin = new CleanPlugin(['dist']);
	const htmlPlugin = new HtmlWebPackPlugin({
		inject: true,
		template: './src/index.html',
		filename: 'index.html'
	});
	const extractCssPlugin = new MiniCssExtractPlugin({
		filename: '[name].[hash].css'
	});
	const scssLintPlugin = new StyleLintPlugin({
		configFile: '.stylelintrc',
		context: path.resolve(__dirname, 'src/'),
		files: '**/*.scss',
		failOnError: false,
		quiet: false
	});
	const faviconPlugin = new FaviconsWebpackPlugin({
		logo: path.resolve(__dirname, 'src/img/logo.png'),
		prefix: devMode ? '' : 'img/favicons/',
		persistentCache: true,
		inject: true,
		icons: {
			background: false,
			android: false,
			appleIcon: true,
			appleStartup: false,
			coast: false,
			favicons: true,
			firefox: false,
			opengraph: false,
			twitter: false,
			yandex: false,
			windows: false
		}
	});

	// populate array
	let pluginArray = [htmlPlugin, scssLintPlugin, extractCssPlugin];
	if (!devMode) { pluginArray.push(faviconPlugin, cleanWebpackPlugin); }

	// return webpack config object
	return {
		devServer: {
			stats: 'minimal',
			historyApiFallback: true,
			host: '0.0.0.0'
		},
		devtool: devMode ? 'source-map' : '',
		performance: { hints: false },
		bail: true,
		entry: './src/index.js',
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					cache: false,
					parallel: true
				}),
				new OptimizeCSSAssetsPlugin({})
			]
		},
		output: {
			path: path.resolve(__dirname, 'dist/'),
			filename: 'main.[hash].js'
		},
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
				}, {
					loader: 'eslint-loader'
				}]
			}, {
				test: /\.(s*)css$/,
				exclude: path.resolve(__dirname, 'node_modules/'),
				use: [{
					loader: MiniCssExtractPlugin.loader,
					options: {
						sourceMap: devMode ? true : false
					}
				}, {
					loader: 'css-loader',
					options: {
						sourceMap: devMode ? true : false
					}
				}, {
					loader: 'postcss-loader',
					options: {
						sourceMap: devMode ? true : false,
						ident: 'postcss',
						plugins: () => [
							require('autoprefixer')({
								browsers: [
									'>1%',
									'last 2 versions',
									'not ie < 11'
								]
							})
						]
					}
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: devMode ? true : false
					}
				}]
			}, {
				test: /\.(gif|png|jpe?g|svg)$/i,
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
		},
		plugins: pluginArray
	};
};
