'use strict'
/**
 * webpack
 */
let gulp = require('gulp')
let webpack = require("webpack")
let WebpackDevServer = require("webpack-dev-server")
let log4js = require('log4js')
let logger = log4js.getLogger()
let util = require('gulp-util')
let shell = require('shelljs');

module.exports = function(settings){
  return gulp.task("dev", function() {
    let dir = util.env.dir?util.env.dir:''
    settings.dir = dir
    let myConfig = require('./common-webpack.config').config(settings)
    let port  = settings.port?settings.port:8080
    myConfig.devtool = "sourcemap";
    var proxy = {
      '/game/': {
        target:settings.proxy=='prod'?'http://api.xintiaotime.com/':'http://api.in.xintiaotime.com/',
        changeOrigin: true
        // secure: false
      },
      '/finder/': {
        target:settings.proxy=='prod'?'http://cms.xintiaotime.com':'http://cms.in.xintiaotime.com',
        changeOrigin: true
        // pathRewrite: {'^/finder' : ''},
      },
      '/demo/': {
        target: settings.proxy=='prod'?'http://demo.xintiaotime.com':'http://demo.in.xintiaotime.com',
        // secure: false
        changeOrigin: true
      },
      '/www/build/': {
        target: 'http://127.0.0.1:'+port +'/build/',
        pathRewrite: {'^/www/build' : ''}
      },
      '/www/admin/': {
        target: 'http://127.0.0.1:'+port+'/html/',
        pathRewrite: {'^/www/admin' : ''}
      }
    }
    if(settings.cProxy){
      proxy = Object.assign({},settings.cProxy,proxy)
    }
    new WebpackDevServer(webpack(myConfig), {
      // noInfo:true,
      // hot:true,
      hotOnly: true,
      // compress: true,
      quiet:false,
      publicPath: myConfig.output.publicPath,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      },
      proxy:proxy
    }).listen(port, "localhost", function(err) {
      logger.info('server start on localhost:'+port)
      let url;
      dir.split(',').forEach(function (v,i) {
        if(v=='game'){
          url = 'http://localhost:'+port+'/www/build/html/game.html?code=ssss#zhida'
        }
        else {
          url = 'http://localhost:'+port+'/www/build/html/' + v + '.html'
        }
        shell.exec('open ' + url)
      })
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
    });
  });
}