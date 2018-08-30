const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require("autoprefixer"); 

const pug_rule = {
  test: /\.pug$/,
  use: ['html-loader?attrs=false', 'pug-html-loader']
};

const styleRule = function(isDev) {
  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader
      },
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: function() {
            return [
              require('autoprefixer')
            ];
          }
        }
      },
      'sass-loader'
    ]
  };
};

const fontRule = {
  test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: 'fonts/'
    }
  }]
};

module.exports = (env, argv) => {
  const isDev = (argv.mode === 'development');
  return {
    entry: {
      app: './src/app.js',
    },
    output: {
      filename: '[name].[chunkhash].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        pug_rule,
        styleRule(isDev),
        fontRule
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Refactor Title to be Configurable',
        filename: 'index.html',
        template: 'src/index.pug'
      }),
      new CleanWebpackPlugin(['dist']),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].css'
      })
    ],
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    }
  };
}
