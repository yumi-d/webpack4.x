const path = require('path');
module.exports = {
    mode: 'development',        // "production" | "development" | "none"
    // 单个入口写法     
    entry: {
        main: './src/index.js'
    },
    // entry: './src/index.js', // 这是单入口的简写
    // entry: {  // 这是多入口写法,每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。
    //     pageOne: './src/pageOne/index.js',
    //     pageTwo: './src/pageTwo/index.js',
    //     pageThree: './src/pageThree/index.js'
    // },
    // 输出
    output: {
        // 决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
        // 也可以使用入口名称（[name].bundle.js）、内部 chunk id（[id].bundle.js）等命名
        filename: 'main.js',    // 打包后文件的名字
        path: path.resolve(__dirname, 'dist'),  // 目标输出目录的绝对路径。
    },
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
            }
          ]
    },




};


