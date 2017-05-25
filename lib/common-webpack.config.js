'use strict'
let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let logger = require('log4js')
let log = logger.getLogger()
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let HtmlWebpackInlineSourcePlugin = require('fusheng-html-webpack-inline-source-plugin');

let config = {
  stats:{
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false
  }
}
module.exports = {
  config: function (settings) {
    var me = this
    me.settings = settings
    me.plugin();
    me.output()
    me.loaders()
    me.entry()
    return config
  },
  output: function () {
    var settings = this.settings
    config.output = {
      path: settings.output,
      filename: "[name]"
    }
    if (settings.env == 'dev') {
      config.output.publicPath = "/www/build/"
    }
  },
  entry: function () {
    var settings = this.settings
    config.entry = {}
    // entry
    let arr = settings.dir ? settings.dir.split(',') : fs.readdirSync(path.resolve(settings.projectPath, 'src'))
    let existArr = []
    arr.forEach(function (v, i) {
      let temp = path.resolve(settings.projectPath, 'src', v + '/')
      if (v !== 'script' && fs.lstatSync(temp).isDirectory()) {
        fs.readdirSync(temp).forEach(function (value, index) {
            if (path.extname(value) == '.js') {
              let key = v + '/' + value
              let val = ['./src/' + key]
              // add import support
              val.push("babel-polyfill")
              if (settings.env == 'dev') {
                let port = settings.port?settings.port:8080
                val.push("webpack-dev-server/client?http://localhost:"+port+"/", "webpack/hot/dev-server")
              }
              config.entry[key] = val
              existArr.push(v)
              let htmlConfig = {
                // inject:true,
                template: './html/' + v + '.html',
                // hash:false,
                chunks:[key],
                inlineSource: '.(js)$',
                // filename:path.resolve(settings.output,'html',v+'.html')
                filename:path.resolve(settings.output,'html',v+'.html')
              }
              if (settings.env == 'prod') {
                htmlConfig.minify = {
                  "removeComments":true,
                    "removeCommentsFromCDATA":true,
                    "removeCDATASectionsFromCDATA":true,
                    "collapseWhitespace":true,
                    "conservativeCollapse":true,
                    "removeAttributeQuotes":true,
                    "useShortDoctype":true,
                    "keepClosingSlash":true,
                    "minifyJS":true,
                    "minifyCSS":true,
                    "removeScriptTypeAttributes":true,
                    "removeStyleTypeAttributes":true
                }
                config.plugins.push(new HtmlWebpackPlugin(htmlConfig))
              }
              else{
                config.plugins.push(new HtmlWebpackPlugin(htmlConfig))
              }
            }

        })
      }
    })
    // find not own src dir files
    if(settings.env!=='prod'){
      return
    }
    let htmlDir = fs.readdirSync(path.resolve(settings.projectPath, 'html'))
    htmlDir.forEach(function(v,i){
      let flag = false
      existArr.forEach(function(value){
        if((value+'.html')==v){
          flag = true
        }
      })
      if(flag){
        return
      }
      let htmlConfig = {
        // inject:true,
        template: './html/' + v,
        // hash:false,
        chunks:[],
        // inlineSource: '.(js)$',
        // filename:path.resolve(settings.output,'html',v+'.html')
        filename:path.resolve(settings.output,'html',v)
      }
      if (settings.env == 'prod') {
        htmlConfig.minify = {
          "removeComments":true,
          "removeCommentsFromCDATA":true,
          "removeCDATASectionsFromCDATA":true,
          "collapseWhitespace":true,
          "conservativeCollapse":true,
          "removeAttributeQuotes":true,
          "useShortDoctype":true,
          "keepClosingSlash":true,
          "minifyJS":true,
          "minifyCSS":true,
          "removeScriptTypeAttributes":true,
          "removeStyleTypeAttributes":true
        }
        config.plugins.push(new HtmlWebpackPlugin(htmlConfig))
      }
    })
  },
  loaders: function () {
    var settings = this.settings
    config.module = {}
    config.module.loaders = [
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
    ]
    config.postcss = function () {
      return [require('autoprefixer')]
    }
    if(settings.babel){
      // config.babel = {
      //   presets: [['env', {
      //     "targets": {
      //       "browsers": ["last 2 versions"]
      //     }
      //     // "modules": false
      //   }]]
      // }
      config.module.loaders.push({
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?presets[]=env&presets[]=react'
      })
    }
  },
  plugin: function () {
    var settings = this.settings
    // plugins
    config.plugins = [
      new CopyWebpackPlugin([{from: './src/script', to: settings.output + '/script/'}]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(settings.env)
      })
    ]
    if (settings.env == 'dev') {
      config.plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    if (settings.env == 'prod') {
      config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          // compress:false,
          compressor: {
            warnings: false,
          }
        }), new HtmlWebpackInlineSourcePlugin()
      )
    }
  }
}