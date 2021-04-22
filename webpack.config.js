var path = require('path');
 var webpack = require('webpack');

 module.exports = {
     entry: './src/app.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.bundle.js'
     },
     module: {
        
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };