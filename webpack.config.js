const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
	const devMode = argv.mode !== 'production';

	// configure plugins
	const cleanWebpackPlugin = new CleanPlugin(['dist']);

	const htmlPlugin = new HtmlWebPackPlugin({
		inject: true,
		template: './src/index.html',
		filename: 'index.html',
		minify: {
			removeComments: true,
			collapseWhitespace: true,
			removeRedundantAttributes: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeStyleLinkTypeAttributes: true,
			keepClosingSlash: true,
			minifyCSS: true,
			minifyJS: true,
			minifyURLs: true
		}
	});
	
	const extractCssPlugin = new MiniCssExtractPlugin({
		filename: 'style.[hash].css'
	});

	const scssLintPlugin = new StyleLintPlugin({
		configFile: '.stylelintrc',
		context: 'src',
		files: '**/*.scss',
		failOnError: false,
		quiet: false
	});

	const faviconPlugin = new FaviconsWebpackPlugin({
		// logo: path.resolve(__dirname, ''),
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

	const compressionPlugin = new CompressionWebpackPlugin({
		deleteOriginalAsssets: true,
		include: /\.js|.css$/
	});

	let pluginArray = [htmlPlugin, scssLintPlugin, extractCssPlugin];
	if (!devMode) { pluginArray.push(faviconPlugin, cleanWebpackPlugin, compressionPlugin); }

	// configure webpack
	return {
		devServer: {
			stats: 'minimal',
			compress: true,
			historyApiFallback: true,
			host: '0.0.0.0'
		},
		devtool: (devMode ? 'cheap-module-eval-source-map' : ''),
		performance: { hints: false },
		bail: true,
		entry: './src/index.js',
		output: {
			path: path.resolve('dist'),
			publicPath: '/',
			filename: 'main.[hash].js'
		},
		module: {
			rules: [{
				test: /\.js$/,
				include: /src/,
				enforce: 'pre',
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['env', 'react', 'babel-preset-stage-3']
					}
				}, {
					loader: 'eslint-loader'
				}]
			}, {
				test: /\.(s*)css$/,
				exclude: /node_modules/,
				use: [{
					loader: (devMode ? 'style-loader' : MiniCssExtractPlugin.loader)
				}, {
					loader: 'css-loader', options: {
						minimize: (devMode ? false : true),
						sourceMap: (devMode ? true : false)
					}
				}, {
					loader: 'postcss-loader',
					options: {
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
					loader: 'sass-loader', options: {
						sourceMap: (devMode ? true : false)
					}
				}]
			}, {
				test: /\.(gif|png|jpe?g|svg)$/i,
				include: path.resolve(__dirname, 'src/img/'),
				use: [{
					loader: 'file-loader',
					options: {
						name: 'img/[name].[ext]'
					}
				}]
			}, {
				test: /\.(woff(2)?|ttf|eot|svg)$/i,
				include: path.resolve(__dirname, 'src/fonts/'),
				use: [{
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[ext]'
					}
				}]
			}, {
				test: /\.html$/,
				exclude: /node_modules/,
				use: [{
					loader: 'html-loader'
				}]
			}]
		},
		plugins: pluginArray
	};
};
