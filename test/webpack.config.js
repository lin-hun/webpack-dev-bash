let path = require('path')
module.exports = require('../index').common.config(
  {
    babel:true,
    env: 'prod',
    output: path.resolve(__dirname, 'build'),
    projectPath: path.resolve()
  }
)