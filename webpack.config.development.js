let webpack = require('webpack');
let webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

let config = {
  entry: [
    'webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr',
    './src/index'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.less$/,
      loader: 'style!css-loader!less-loader'
    }, {
      test: /\.png|\.svg$/,
      loaders: ['file-loader']
    }]
  },
  output: {
    path: __dirname + '/app',
    publicPath: 'http://localhost:9000/app/',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map'
};

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
