const path = require('path');

module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), 
    },
    compress: true,
    hot: true,
    port: 9000,
  },
  // Pack glbs into bundle.js
  module: {
    rules: [
      {
        test: /\.glb$/, // Match only GLB files
        use: 'raw-loader', // Use the `raw-loader`
      },
    ],
  },
};
