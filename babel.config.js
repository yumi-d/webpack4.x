module.exports = function (api) {
    api.cache(true);
    const presets = [
        "@babel/preset-react",
        ["@babel/preset-env"],  
    ];
    // es7不同阶段语法提案的转码规则模块（共有4个阶段），分别是stage-0，stage-1，stage-2，stage-3。
    // babel 7 以后删除了 stage-0，stage-1，stage-2，stage-3，改用plugins，以下兼容老版本stage-3
     const plugins = [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        ["@babel/plugin-proposal-class-properties", {"loose": false}], 
        "@babel/plugin-proposal-json-strings",
    ];
    return {
        presets,
        plugins 
    };
};