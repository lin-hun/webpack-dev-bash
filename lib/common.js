'use strict'
let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let logger = require('log4js')
let log = logger.getLogger()
let CopyWebpackPlugin = require('copy-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
let ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// exreact
let ExtractTextPlugin = require("extract-text-webpack-plugin")

let config = {
  stats:{
    hash: false,
    version: true,
    timings: true,
    assets: true,
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
    me.dev = settings.env == 'dev'?true:false
    me.prod = !me.dev
    me.plugin()
    me.output()
    me.loaders()
    me.entry()
    return config
  },
  output: function () {
    var settings = this.settings
    var me = this
    config.output = {
      path: settings.output,
      filename: "[name]?[chunkhash]",
      publicPath:settings.publicPath?settings.publicPath:"../"
    }
    if (me.dev) {
      config.output.publicPath = "/www/build/"
      config.output.filename = "[name]"
    }
  },
  entry: function () {
    var settings = this.settings
    var me = this
    config.entry = {}
    // entry
    let arr = settings.dir ? settings.dir.split(',') : fs.readdirSync(path.resolve(settings.projectPath, 'src'))
    let existArr = []
    // src | settings.dir
    arr.forEach(function (v, i) {
      let temp = path.resolve(settings.projectPath, 'src', v + '/')
      if (v !== 'script' && fs.lstatSync(temp).isDirectory()) {
        fs.readdirSync(temp).forEach(function (value, index) {
            if (path.extname(value) == '.js') {
              let key = v + '/' + value
              let val = ['./src/' + key]
              if (me.dev) {
                let port = settings.port?settings.port:8080
                val.push("webpack-dev-server/client?http://localhost:"+port+"/", "webpack/hot/dev-server")
              }
              config.entry[key] = val
              existArr.push(v)
              //
              let htmlConfig = {
                // inject:true,
                template: './html/' + v + '.html',
                // hash:false,
                chunks:[key],
                inlineSource: '.(js)$',
                // filename:path.resolve(settings.output,'html',v+'.html')
                filename:path.resolve(settings.output,'html',v+'.html')
              }
              if (me.prod) {
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
                    "removeStyleTypeAttributes":true,
                }
                htmlConfig.inlineSource =  '.(css)$'
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
    if(me.dev){
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
      if (me.prod) {
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
    config.module.rules = [
      {
        test: /\.css/,
        use:[
          {
            loader:'style-loader'
          },
          {
            loader:'css-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
    ]
    // scss
    let scssRules = {
      test: /\.scss$/,
      use:[

        {
          loader:'style-loader'
        },
        {
          loader:'css-loader'
        },
        {
          loader:'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')(),
            ]
          }
        },
        {
          loader:'sass-loader'
        }
      ]}
    if(this.prod){
      scssRules.use =  ExtractTextPlugin.extract({
        use: ['css-loader', {
          loader:'postcss-loader',
          options: {
            plugins: (loader) => [
              require('autoprefixer')(),
            ]
          }
        },'sass-loader']
      })
    }
    config.module.rules.push(scssRules)
    // babel
    if(settings.babel){
      config.module.rules.push({
        test: /\.js[x]?$/,
        exclude: /(node_modules|bower_components)/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['env','react'],
            plugins: [require('babel-plugin-transform-async-to-generator')]
          }
        }
      })
    }
  },
  plugin: function () {
    var me = this
    var settings = this.settings
    // plugins
    config.plugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(settings.env)
      })
    ]
    if(fs.existsSync('./src/script')){
      config.plugins.push(new CopyWebpackPlugin([{from: './src/script', to: settings.output + '/script/'}]))
    }
    if (me.dev) {
      config.plugins.push(new webpack.HotModuleReplacementPlugin())
      config.plugins.push(new webpack.NamedModulesPlugin())
    }
    if (me.prod) {
      config.plugins.push(
        new ExtractTextPlugin({
          filename:  (getPath) => {
            return getPath('[name]').replace('.js', '.css')
          },
          allChunks: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ParallelUglifyPlugin({
          cacheDir: '.cache/',
          uglifyJS:{
            output: {
              comments: false
            },
            compress: {
              warnings: false
            }
          }
        })
        , new HtmlWebpackInlineSourcePlugin()
      )
    }
  }
}