const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',    // 打包后文件的名字
    path: path.resolve(__dirname, 'dist'),  // 打包后的文件夹
  }
};


