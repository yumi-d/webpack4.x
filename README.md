# webpack4.x详细配置(React版)
## 目录
* [前言](#前言)
* [概念](#概念)
* [安装](#安装)
* [入口和出口](#入口和出口)
* [出口](#出口)

### 前言
从webpack1.x用到webpack4.x，却从来没有去系统的总结一下详细配置，所有就写个文章总结一下，也给初学者一个引导。本文所有内容均来自[webpack官网](https://www.webpackjs.com/)


### 概念
首先开局一张图~
![](https://github.com/yumi41/webpack4.x/blob/master/images/webpack_logo.jpg)
就是把左边的资源、脚本、图片、样式表打包成右边我们需要的静态资源，而不用关心中间一些复杂的操作。
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

### 入口和出口
现在在 `package.json` 中添加 `"build": "webpack"`
```
  "scripts": {
    "build": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
当然也可以指定webpack要读取的配置文件，比如: `webpack --config webpack.config2.js` 。
</br>现在我们在根目录创建 `webpack.config.js` 文件，内容如下:
```
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
      
      
      
