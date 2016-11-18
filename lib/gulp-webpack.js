'use strict'
/**
 * webpack
 */
let gulp = require('gulp')
let webpack = require("webpack")
let WebpackDevServer = require("webpack-dev-server")
let logger = require('log4js')
let log = logger.getLogger()
let util = require('gulp-util')

module.exports = function(settings){
  return gulp.task("dev", function() {
    let dir = util.env.dir?util.env.dir:''
    settings.dir = dir
    let myConfig = require('./common-webpack.config').config(settings)
    myConfig.devtool = "sourcemap";
    new WebpackDevServer(webpack(myConfig), {
      // noInfo:true,
      hot:true,
      // compress: true,
      quiet:false,
      publicPath: myConfig.output.publicPath,
      stats: {
        colors: true
      },
      proxy:{
        '/game/': {
          target: 'http://123.207.164.190',
          changeOrigin: true
          // secure: false
        },
        '/finder/': {
          target: 'http://cms.in.xintiaotime.com',
          changeOrigin: true
          // pathRewrite: {'^/finder' : ''},
        },
        '/demo/': {
          target: 'http://demo.in.xintiaotime.com',
          // secure: false
          changeOrigin: true
        },
        '/www/build/': {
          target: 'http://127.0.0.1:8080/build/',
          pathRewrite: {'^/www/build' : ''}
        },
        '/www/admin/': {
          target: 'http://127.0.0.1:8080/html/',
          pathRewrite: {'^/www/admin' : ''}
        }
      }
    }).listen(8080, "localhost", function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
    });
  });
}