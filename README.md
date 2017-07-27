## support
  + multiple files entry
  + js、css & html livereload
  + proxy switch 
  + ~~some simple gulp tasks~~
## install
```script
npm i webpack-dev-bash --save-dev
```
## usage
#### webpack config
```script
let path = require('path')
module.exports = require('webpack-dev-bash').common.config(
  {
    env: 'prod',
    output: path.resolve(__dirname, 'build'),
    projectPath: path.resolve()
  }
)
```
#### gulp config
```script
let path = require('path')
require('webpack-dev-bash').dev(
  {
    env: 'dev',
    output: path.resolve(__dirname, 'build'),
    projectPath: path.resolve()
  }
)
```
#### hot reload
insert in js
```javascript
    if(module.hot){
          module.hot.accept();
        }
```
#### inline reload
insert in js
```javascript
    if (process.env.NODE_ENV !== 'prod') {
      require('../../html/index.html')
    }
```
#### demo
demo in test/ 

## log
  + 2.2.4 js ref add hash
  + 2.2.3 support async & await
  + 2.2.1 remove gulp 
  + 2.1.2 extract css in html 
  + 2.1.0 webpack3 
  + 2.0.9 add parallel uglify => reduce build time
  + 2.0.8 add public path define
  + 2.0.7 add .css solve
  + 2.0.6 fix some bugs 
  + 2.0.0 migrate to webpack2 & add example
  + 1.5.8 support react & jsx
  + 1.5.5 simplify package dependence
  + 1.5.0 add unix support open browser
  + 1.4.8 add post css support & autoprefixer
  + 1.4.7 add babel support 
  + 1.4.1 add proxy define
  + 1.4.0 fix src bug
  + 1.3.9 hidden no useful msg
  + 1.3.8 null
  + 1.3.7 add change build html dir & quite log
  + 1.3.6 add html minify
  + 1.3.5 add html-webpack-inline-source support
  