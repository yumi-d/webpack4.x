# webpack4.x详细配置(React版)
## 目录
* [前言](#前言)
* [概念](#概念)
* [安装](#安装)
* [输入和输出](#输入和输出)


### 前言
从webpack1.x用到webpack4.x，却从来没有去系统的总结一下详细配置，所有就写个文章总结一下，也给初学者一个引导。本文所有内容均来自[webpack官网](https://www.webpackjs.com/)


### 概念
首先开局一张图~
![](https://github.com/yumi41/webpack4.x/blob/dev/images/webpack_logo.jpg)
意思就是把左边的资源、脚本、图片、样式表打包成右边我们需要的静态资源，而不用关心中间一些复杂的操作。
</br>
比如:

    * 代码分割、去除多余模块。
    * 代码、图片压缩。
    * Scss，less等CSS预处理器
    * ...
    
好了，来看看官方的描述:</br>
    
    本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
    
### 安装
首先初始化项目:
      
      npm init
然后根据提示安装就好了（全部敲回车就是默认安装）。</br>
然后安装webpack:

      //安装到你当前的项目中
      npm install --save-dev webpack
      // 因为是4.x版本，所以还要安装 CLI
      npm install --save-dev webpack-cli  
推荐使用 `npm install --save-dev webpack` 安装，如果你有多个项目的话，可能会有多个webpack版本，全局安装webpack可能会影响其他项目。</br>

### 输入和输出
现在在 `package.json` 中添加 `"build": "webpack"`
```
  "scripts": {
    "build": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
当然也可以指定webpack要读取的配置文件，比如: `webpack --config webpack.config2.js` 。</br>
现在依次创建 `index.html` `index.js` `webpack.config.js`

index.html
```
<!doctype html>
<html>
  <head>
    <title>起步</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
    <script src="./dist/main.js"></script>
  </body>
</html>
```
index.js
```
function component() {
  var element = document.createElement('div');
  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());
```
webpack.config.js
```
const path = require('path');
module.exports = {
    // 输入   
    entry: {
        main: './src/index.js'
    },
    // 输出
    output: {
        // 决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
        // 也可以使用入口名称（[name].bundle.js）、内部 chunk id（[id].bundle.js）等命名
        filename: 'main.js',    // 打包后文件的名字
        path: path.resolve(__dirname, 'dist'),  // 目标输出目录的绝对路径。
    }
};
```
本地开发输出中的 `filename` 可以写死，长效缓存时再使用其他值。还有比较重要的 `chunkFilename` `publicPath` 后面再讲。</br>
现在的目录结构如下:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/input_output.jpg)</br>
然后执行打包命令

      npm run build

会看到如下打包信息:
![](https://github.com/yumi41/webpack4.x/blob/dev/images/build.jpg)</br>
从图片来看出来有一个警告，需要我们设置 `mode` ，本地开发设置为 `development` ，后面再具体说明。设置后再打包就不会有警告了，部分配置如下:
```
const path = require('path');
module.exports = {
    mode: 'development',        // "production" | "development" | "none"
    // 输入     
    entry: {
        main: './src/index.js'
    },
```

      
