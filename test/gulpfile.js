let path = require('path')
var proxy = 'prod'
// var proxy = 'dev'
require('webpack-dev-bash').dev(
  {
    babel:true,
    env: 'dev',
    output: path.resolve(__dirname, 'build'),
    projectPath: path.resolve(),
    proxy:proxy,
    cProxy:{
      /*'/game/chapters': {
        target:'http://localhost:8080/data/ssss-chapters.json',
        changeOrigin: true,
        pathRewrite: {'^/game/chapters' : ''}
        // secure: false
      },*/
      '/finder/game/preview': {
        target:'http://localhost:8080/data/preview.json',
        changeOrigin: true,
        pathRewrite: {'^/finder/game/preview' : ''},
        secure: false
      },
      '/n/': {
        target: 'http://node.xintiaotime.com/',
        changeOrigin: true
        // secure: false
      },
      '/user/': {
        target:proxy=='prod'?'http://api.xintiaotime.com/':'http://api.in.xintiaotime.com/',
        changeOrigin: true
        // secure: false
      },
      '/hook/':{
        target: proxy=='prod'?'http://cms.xintiaotime.com/':'http://cms.in.xintiaotime.com/',
        changeOrigin: true
      },
      '/read/':{
        target: proxy=='prod'?'http://api.xintiaotime.com/':'http://api.in.xintiaotime.com/',
        changeOrigin: true
      }
    }
  }
)