const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');

const DEV = 'development';
const PROD = 'production';

const ProdUglifyOpt = {
  warnings: false,
  output: {
    comments: false,
  },
  compress: {
    drop_debugger: true,
    drop_console: true,
  }
};

module.exports = (env, argv) => ({
  entry: './src/index.js',
  output: {
    filename: argv.mode === DEV ? 'i.js' : 'i.min.js',
    path: __dirname + '/dist'
  },
  module: {
      rules: [
      {
        parser: {
          amd: false
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: argv.mode === DEV ? {} : ProdUglifyOpt
      }),
      new Webpack.BannerPlugin({
        banner: `Build timestamp: ${new Date().toString()}\nCommit hash: ${process.env.COMMIT_HASH}`
      })
    ]
  },
  devtool: argv.mode === DEV ? 'source-map' : false,
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.COMMIT_HASH': JSON.stringify(process.env.COMMIT_HASH)
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  watch: argv.watch === 'true',
  performance: {
    hints: false
  }
});
