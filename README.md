# webpack4.x常用配置
## 目录
* [前言](#前言)
* [概念](#概念)
* [安装](#安装)
* [输入和输出](#输入和输出)
* [babel简介](#babel简介)
* [module](#module)
   * [babel-loader](#babel-loader)
   * [css/style-loader](#css/style-loader)
   * [file-loader](#file-loader)
      * [说说publicPath](#说说publicPath)
      * [url-loader](#url-loader)

### 前言
从webpack1.x用到webpack4.x，却从来没有去系统的总结一下详细配置，所有就有了这篇文章。本文由浅到深，有些配置放在后面才说，还请见谅。本文主要内容来自 [webpack官网](https://www.webpackjs.com/)


### 概念
首先开局一张图~
![](https://github.com/yumi41/webpack4.x/blob/dev/images/webpack_logo.jpg)
大概意思就帮我们处理资源，是把左边的资源、脚本、图片、样式表打包成右边我们需要的静态资源，而不用关心中间一些复杂的操作。比如:

    * 模块管理
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
现在在 `package.json` 中添加 `"build": "webpack"` （默认读取项目根目录的 `webpack.config.js` 文件）
```
  "scripts": {
    "build": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
> 指定读取：`"build": "webpack --config xx/xxx.js"`

现在依次创建 `index.html` ， `src/index.js` ， `webpack.config.js`

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
src/index.js
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
本地开发输出中的 `filename` 可以成固定值，长效缓存时再使用其他值。还有比较重要的 [publicPath](#说说publicPath) 和 `chunkFilename` 后面再介绍。</br>
现在的目录结构如下:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/input_output.jpg)</br>
然后执行打包命令

      npm run build

会看到如下打包信息:
![](https://github.com/yumi41/webpack4.x/blob/dev/images/build.jpg)</br>
从图片来看出来有一个警告，需要我们设置 `mode` ，本地开发设置为 `development` 设置后再打包就不会有警告了，部分配置如下:
```diff
const path = require('path');
module.exports = {
+   mode: 'development',  // "production" | "development" | "none"
    // 输入     
    entry: {
        main: './src/index.js'
    },
```
打开index.html就可以看到效果了。
      
### babel简介
Babel 是一个 JavaScript 编译器，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。大概的作用就是:
      
      * 语法转换
      * 通过 Polyfill 方式在目标环境中添加缺失的特性，比如：promise
      * 源码转换
      
现在让我们来安装基本的模块:

      npm install --save-dev @babel/core @babel/preset-env @babel/preset-react
      
大概解释如下:

      * @babel/core: 核心包，某些代码需要调用Babel的API进行转码
      * @babel/preset-react: react转码规则
      * @babel/preset-env: 支持不同版本的ECMAScript规范,在此之前是要安装babel-preset-es20XX。现在 @babel/preset-env 会自动匹配最新的环境

安装后我们需要在配置文件中进行配置，Babel 配置文件有两种方式， `.babelrc` 和 `babel.config.js`，其中 `babel.config.js` 是 `babel7.x` 后才支持的，在此我们选择 `babel.config.js`。在项目的根目录下创建一个名为 `babel.config.js` 的文件，并输入如下内容:
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
如果我想使用处于提案中不同阶段的语法（共有4个阶段）。</br>
在 `babel7.x` 之前(选择一个安装):
      
      npm install --save-dev babel-preset-stage-0
      npm install --save-dev babel-preset-stage-1
      npm install --save-dev babel-preset-stage-2
      npm install --save-dev babel-preset-stage-3
      
不稳定性和包涵关系: stage-0 > stage-1 > stage-2 > stage-3。由于提案是不断变化的，所以 `babel7.x` 后移除了 `babel-preset-stage-X` ，改为引入plugins， [babel7升级不完全指南](https://github.com/chenxiaochun/blog/issues/61)。</br>

我们选择最稳定的 `stage-3` ：

      npm install --save-dev @babel/plugin-syntax-dynamic-import @babel/plugin-syntax-import-meta @babel/plugin-proposal-class-properties @babel/plugin-proposal-json-strings

当然想用哪个就引入哪个，除此之外还有 [其他](https://github.com/babel/babel/tree/master/packages) 的插件可以引用。接着上面的安装进行配置:
```diff
module.exports = function (api) {
    api.cache(true);
    const presets = [
        "@babel/preset-react",
        ["@babel/preset-env"],  
    ];
+    // es7不同阶段语法提案的转码规则模块（共有4个阶段），分别是stage-0，stage-1，stage-2，stage-3。
+    // babel 7 以后删除了 stage-0，stage-1，stage-2，stage-3，改用plugins，以下兼容老版本stage-3
     const plugins = [
+        "@babel/plugin-syntax-dynamic-import",
+        "@babel/plugin-syntax-import-meta",
+        ["@babel/plugin-proposal-class-properties", {"loose": false}], 
+        "@babel/plugin-proposal-json-strings",
    ];
    return {
        presets,
        plugins 
    };
};
```
此时的目录结构为:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/babel.config.jpg)

至此，环境准备的差不多了，下面我们来引入React:

      npm install --save react react-dom
      
然后在 `src` 创建新文件夹 `page`， 然后在 `page` 中创建 `Home.js` 文件，内容如下:
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
然后 `index.js` 文件替换为:
```
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './page/Home'

ReactDOM.render(
  <Home/>,
  document.getElementById('app')
);
```
在 `index.js` 中可以看到，React会把 `<Home/>` 渲染到app节点上去，所以index.html要新增 `<div id="app"></div>`

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
此时的文件结构:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/add_react.jpg)</br>

执行 `npm run build` 会发现报错:

![](https://github.com/yumi41/webpack4.x/blob/dev/images/loader.jpg)</br>

看错误是需要 `loader` 来处理 `<Home/>` 类型的文件。让我们来看看module把。

### module
经过 `babel` 环境配置后，发现打包并不能成功，因为 webpack 要对模块进行处理。</br>
对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：
* ES2015 import 语句
* CommonJS require() 语句
* AMD define 和 require 语句
* css/sass/less 文件中的 @import 语句。
* 样式(url(...))或 HTML 文件(`<img src=...>`)中的图片链接(image url)

webpack 通过 loader 可以支持各种语言和预处理器编写模块。loader 描述了 webpack 如何处理 非 JavaScript(non-JavaScript) _模块_，并且在 bundle 中引入这些依赖。 webpack 社区已经为各种流行语言和语言处理器构建了 loader，包括：

* CoffeeScript
* TypeScript
* Less
* Sass

todo 解析规则。

#### babel-loader

好了，现在我们引入 `babel-loader` 来处理js。

      npm install babel-loader --save-dev

再配置 `webpack.config.js` :

```diff
    output: {
        // 决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
        // 也可以使用入口名称（[name].bundle.js）、内部 chunk id（[id].bundle.js）等命名
        filename: 'main.js',    // 打包后文件的名字
        path: path.resolve(__dirname, 'dist'),  // 目标输出目录的绝对路径。
    },
+    module: {
+        rules: [
+            {
+              test: /\.js$/,             // 匹配文件规则
+              exclude: /(node_modules)/, // 排除要匹配的文件夹，提高构建速度
+              use: {
+                loader: 'babel-loader',
+                options: {   
+                    cacheDirectory: true,               // 开启缓存 提高构建速度
+                    // presets: ['@babel/preset-env'],  // 没有 babel.config.js 文件，在这里也可以进行配置
+                    // plugins:[]
+                }
+              }
+            }
+          ]
+    },

```
这个时候执行打包命令就可以成功了。</br>

#### css/style-loader

为了处理css文件，我们要引入 [css-loader](https://www.webpackjs.com/loaders/css-loader/) 和 [style-loader](https://www.webpackjs.com/loaders/style-loader/) 。

      npm install --save-dev css-loader style-loader
> `css-loader` 用于处理css文件;<br/>

> `style-loader` 一般和 css-loader 一起使用，用于把css注入到html的<style>标签中,但是会导致html文件变大，建议开发环境使用，生产请对css进行拆分, [后面说明](#other)
      
然后配置 `webpack.config.js` :
```diff
    module: {
        rules: [
            {
              test: /\.js$/,             // 匹配文件规则
              exclude: /(node_modules)/, // 排除要匹配的文件夹，提高构建速度
              use: {
                loader: 'babel-loader',
                options: {   // 没有 babel.config.js 文件，在这里也可以进行配置
                    cacheDirectory: true,               // 开启缓存 提高构建速度
                    // presets: ['@babel/preset-env'],
                    // plugins:[]
                }
              }
            },
+            {
+                test: /\.css$/,
+                use: [
+                    'style-loader',
+                    'css-loader',
+                ],
+            },
```
上面讲到use配置规则
接下来创建 `Home.css` 文件，在 `Home.js` 中引入:</br>
Home.css:
```
.test{
    color: red
}
```
Home.js:
```diff
import React from 'react';
+ import './Home.css'
class Home extends React.Component {
    render(){
        return (
-            <div>Hello, world!!!</div>
+            <div className="test">Hello, world!!!</div>
        )
    }
}
export default Home;
```
再次打包并且打开 `index.html` 文件，发现字体变成红色了。

#### file-loader

为了处理图片，我们安装 `file-loader` 和 `url-loader`:

      npm install --save-dev file-loader url-loader

`file-loader` 大概作用就是处理文件对象并返回真实的文件路径，默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。引用官网的 [例子](https://www.webpackjs.com/loaders/file-loader/):

      import img from './file.png' 

将会生成文件 file.png，输出到输出目录并返回 public URL。
      
      "/public/path/0dcbbaa7013869e351f.png"
      
现在修改 `webpack.config.js` ，[更多选项](https://www.webpackjs.com/loaders/file-loader/):
```diff
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
+            {
+                test: /\.(png|svg|jpg|gif)$/,
+                use: [
+                    {
+                        loader: 'file-loader',
+                        options: {
+                            name: 'images/[name].[ext]', // 指定文件夹和文件名生成规则
+                        }
+                    }
+                ]
+            },
```

#### 说说publicPath

`url-loader` 功能类似于 `file-loader`，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
      



### other
建议本地开发使用（因为支持热重载（link跳转））；如果想把css剥离成文件，webpack4之前使用 [extract-text-webpack-plugin](https://www.webpackjs.com/plugins/extract-text-webpack-plugin/)，之后可以使用插件 [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin) (webpack5.x 可能会内置类似的插件)

      
      
