const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package.json');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
    open: true,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      remotes: {
        app2: 'app2@http://localhost:3002/remoteEntry.js',
        app3: 'app3@http://localhost:3003/remoteEntry.js',
      },
      // shared: ['react', 'react-dom'],
      shared: {
        react: { singleton: true, eager: true, requiredVersion: PACKAGE.dependencies.react },
        "react-dom": { singleton: true, eager: true, requiredVersion: PACKAGE.dependencies["react-dom"] }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
