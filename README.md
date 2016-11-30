## support
  + multiple files entry
  + js、css & html livereload
  + proxy switch 
  + some simple gulp tasks 
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
## log
  + 1.3.6 add html minify
  + 1.3.5 add html-webpack-inline-source support
  