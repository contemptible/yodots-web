const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv-webpack');

module.exports = function(env) {
	env = env || 'local';
	return {
    // where to start bundling
		entry: {
			main: ["webpack/hot/dev-server", "./index.js"]
		},

    // where to output
		output: {
			path: path.join(process.cwd(), 'dist'),
			filename: "[name].js"
		},

		node: {
			"fs": "empty", 
			net: "empty", 
			dns: "empty", 
			dirname: true, 
			filename: true, 
			require: true
		},

    // how to resolve encountered imports
		module: {
			rules: [
			  { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
			  { test: /\.(png|jpg)$/, loader: 'file-loader', options: { name: 'assets/images/[name].[ext]' } },
			  { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'file-loader' }] },
			  { test: /\.(eot|ttf|svg)$/, loader: 'file-loader' },
			  { test: /\.(html)$/, loader: 'html-loader' },
	          { test: /.css$/, use: ['style-loader', 'css-loader'] }
			]
		},

    devServer: {
      contentBase: "./",
      port: 3001
    },

    resolve: {
    	alias: {
    		'~': path.resolve(process.cwd())
    	}
    },

    // what extra processing to perform
    plugins: [
      new webpack.HotModuleReplacementPlugin(), 
      new HtmlWebpackPlugin({template: './index.html'}),
      new dotenv({ path: path.join(__dirname, '.configs', `${env}.env`) })
    ]
	}
}