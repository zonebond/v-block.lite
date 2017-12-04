const path    = require('path');
const entries = require('./utils/entries');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  DebugMode: false,
  entry: (entry) => {
    const polyfills = entry.shift();

    return entries.points.reduce((acc, point) => {
      acc[point] = [polyfills, path.resolve('./src', point, 'index.js')];
      return acc;
    }, {});
  },
  output: (output) => {
    output.filename       = '[name].js';
    output.libraryTarget  = 'umd';
    output.umdNamedDefine = true;
  },
  plugins: (plugins) => {
    // remove html-webpack-plugin
    plugins.splice(1, 1);
    // remove manifest-plugin
    plugins.splice(4, 1);
    // remove sw-precache-webpack-plugin
    plugins.splice(4, 1);

    plugins[2].options = {
      parallel: true,
      sourceMap: false,
      uglifyOptions: {
        compress: {warnings: false, comparisons: false, drop_debugger: true, keep_fnames: true},
        output: {comments: false}
      }
    }
    // webpack-bundle-analyzer
    plugins.push(new BundleAnalyzerPlugin());
  },
  externals: [
    'react', 
    'v-block.lite/common', 'v-block.lite/layout', 'v-block.lite/library'
  ]
}