module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=react',
      },
    ]
  }
};
