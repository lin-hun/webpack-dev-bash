'use strict'
let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let logger = require('log4js')
let log = logger.getLogger()
let CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')

let config = {

}
module.exports = {
  config:function(settings){
    var me = this
    me.plugin(settings);
    me.output(settings)
    me.loaders()
    me.entry(settings)
    return config
  },
  output:function(settings){
    config.output = {
      publicPath: "/www/build/",
      path: settings.output,
      filename: "[name]"
    }
  },
  entry:function(settings){
    config.entry = {}
    // entry
    let arr = settings.dir ? settings.dir.split(',') : fs.readdirSync(path.resolve(settings.projectPath,'src'))
    arr.forEach(function (v, i) {
      let temp = path.resolve(settings.projectPath, 'src',v + '/')
      if (v !== 'script') {
        if (fs.existsSync(temp + '/index.js')) {
          let key = v + '/index.js'
          let value = ['./src/' + key]
          if(settings.env=='dev'){
            value.push("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server")
          }
          config.entry[key] = value
          // add html plugin to js
          if(settings.env=='dev'){
            config.plugins.push(new HtmlWebpackPlugin({
              template: './html/' + v + '.html'
            }))
          }

        }
      }
    })
  },
  loaders:function(){
    config.module = {}
    config.module.loaders = [
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      }
      ]
  },
  plugin :function(settings){
    // plugins
    config.plugins = [
      new CopyWebpackPlugin([{from: './src/script', to: settings.output + '/script/'}]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(settings.env)
      })
    ]
    if(settings.env=='dev'){
      config.plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    if(settings.env=='prod'){
      config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false,
          }
        })
      )
    }
  }
}