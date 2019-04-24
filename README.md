# webpack4.x详细配置(React版)
## 目录
* [前言](#前言)
* [概念](#概念)
* [安装](#安装)
* [输入和输出](#输入和输出)
* [babel简介](#babel简介)
* [module](#module)


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
```diff
const path = require('path');
module.exports = {
+   mode: 'development',        // "production" | "development" | "none"
    // 输入     
    entry: {
        main: './src/index.js'
    },
```
打开index.html就可以看到效果了（注意打包后的文件在index.html中的引入路径）
      
### babel简介
现在我们来引入React，先执行命令：

      npm install --save react react-dom

index.js文件替换为:
```
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('app')
);
```
相当于把 `<h1>Hello, world!</h1>` 渲染到app节点上去，所以index.html要新增 `<div id="app"></div>`

```diff
<!doctype html>
<html>
  <head>
    <title>起步</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
+   <div id="app"></div>
    <script src="./dist/main.js"></script>
  </body>
</html>
```
执行 `npm run build` 会发现报错:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/loader.jpg)</br>

错误说明在入口文件中，需要loader来处理文件类型，这时就要请出我们的 `babel` 了。</br>
引用 [babel](https://www.babeljs.cn/) 官网的话：

      Babel 是一个 JavaScript 编译器
这是因为新语法不能够马上被现在的浏览器全部支持，所以要用 `babel` 把我们所写的代码转换成浏览器所能识别的代码，比如:

      * react语法
      * ES6/7/8
      * 处于提案的语法
      * ...
在 `babel7.x` 之前要在根目录下引入配置文件: `.babelrc`，`7.x` 后可以在项目的根目录下创建一个名为 `babel.config.js` 的文件，推荐使用后者。

现在安装我们所需要的模块:

      npm install --save-dev @babel/core  @babel/preset-env @babel/preset-react

大概作用就是:

      @babel/core:核心包，某些代码需要调用Babel的API进行转码
      @babel/preset-env:转码规则，在此之前是要安装babel-preset-es20XX的，经常会变。现在 `@babel/preset-env` 会自动匹配最新的环境
      @@babel/preset-react:react转码规则

配置如下:
```
module.exports = function (api) {
    api.cache(true);
    const presets = [
        "@babel/preset-react",
        ["@babel/preset-env"],
    ];
    const plugins = [];
    return {
        presets,
        plugins
    };
};
```
更多模块可以参考 [babel指南](https://www.babeljs.cn/docs/usage)。</br>
更多详细信息可以参考 [阮一峰](http://www.ruanyifeng.com/blog/2016/01/babel.html)（虽然已经过时了，但是可以更好的理解现在的配置）。

### module
经过 `babel` 环境配置后，我们还需要引入 `babel-loader` 来解析我们的模块，

      npm install babel-loader --save-dev

再配置 `webpack.config.js` :

```
module: {
        rules: [
            {
              test: /\.js$/,             // 匹配文件规则
              exclude: /(node_modules)/, // 排除要匹配的文件夹，提高构建速度
              use: {
                loader: 'babel-loader',
                options: {   // 没有 babel.config.js 文件，在这里也可以进行环境配置
                    cacheDirectory: true,               // 开启缓存 提高构建速度
                    // presets: ['@babel/preset-env'],
                    // plugins:[]
                }
              }
            }
          ]
    },

```
这个时候执行打包命令就可以成功了。</br>

好了，现在让我们来扩大先有的项目，并且用更方便的ES6语法。
首先在src目录下创建page文件夹，并且创建 `Home.js` 文件：

```
import React from 'react';
class Home extends React.Component {
    render(){
        return (
            <div>Hello, world!!!</div>
        )
    }
}
export default Home;
```
修改 `src/index.js` :

```diff
import React from 'react';
import ReactDOM from 'react-dom';
+ import Home from './page/Home'

ReactDOM.render(
  <Home/>,
  document.getElementById('app')
);
```
此时的文件目录文:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/Home.js.jpg)</br>

再次打包发现不会报错。好，ES6的class是用上了，现在我想用class的 `static` :

```diff
import React from 'react';
class Home extends React.Component {
+   static data = 1;
    render(){
        return (
            <div>Hello, world!!!</div>
        )
    }
}
export default Home;

```
再次打包发现报错:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/class_static.jpg)</br>

看错误是 `class` 不支持 `static` 这个属性，没关系，我们让它支持:

      npm install @babel/plugin-syntax-dynamic-import @babel/plugin-syntax-import-meta @babel/plugin-proposal-class-properties @babel/plugin-proposal-json-strings --save-dev

如果只是支持 `static` 的话 可以只安装 `@babel/plugin-proposal-class-properties` 就可以了，然后要配置 `babel.config.js` :

```diff
module.exports = function (api) {
    api.cache(true);
    const presets = [
        "@babel/preset-react",
        ["@babel/preset-env"],  
    ];
+    // es7不同阶段语法提案的转码规则模块（共有4个阶段），分别是stage-0，stage-1，stage-2，stage-3。
+    // babel 7 以后删除了 stage-0，stage-1，stage-2，stage-3，改用plugins，以下兼容老版本stage-3
+    const stage_3 = [
+        "@babel/plugin-syntax-dynamic-import",
+        "@babel/plugin-syntax-import-meta",
+        ["@babel/plugin-proposal-class-properties", {"loose": false}], 
+        "@babel/plugin-proposal-json-strings",
+    ];
    const plugins = [
+        ...stage_3,
+       "@babel/plugin-transform-runtime", // 支持 async await （还需要 npm install --save @babel/runtime）
    ];
    return {
        presets,
        plugins 
    };
};
```

      
      
