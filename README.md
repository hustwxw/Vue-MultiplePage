# Vue-MutiplePage

> Vue多页面脚手架，支持Vue多页面构建以及多页面内某个页面的单页面混合构建

## 说明

> Vue-MutiplePage以Vue-cli官方单页面脚手架为基础（Vue init webpack）改造而来，涉及变动的配置文件如下说明：

### 1. build/utils.js
> 新增以下三个方法
```bash
// 单入口改为多文件入口
exports.getEntry = (globPath) => {
  var entries = {}
  console.log(glob.sync(globPath))
  glob.sync(globPath).forEach(function (entry) {
    /*
      entry的值类似：./src/page/page1/index.js
      去掉头部的./src/
      去掉尾部的文件名index.js
      保留中间的文件目录，也就是http url访问的路径
    */
    var temp = entry.split('/')
    temp.splice(0, 1)
    temp.splice(0, 1)
    temp.splice(temp.length - 1, 1)
    entries[temp.join('/')] = entry
  })
  return entries
}
// 指明多文件中的js路径（相当于单页面中的main.js的路径）
exports.getJsPath = () => {
  return './src/page/**/*.js'
}
// 指明多文件中的html路径
exports.getHtmlPath = () => {
  return './src/page/**/*.html'
}

```
### 2. build/webpack.base.conf.js
将单页面入口配置改为多页面入口配置
```bash
// 单页面入口
module.exports = {
  entry: {
    app: './src/main.js'
  }
}
```
```bash
// 多页面入口
const entries = utils.getEntry(utils.getJsPath())
module.exports = {
  entry: entries
}
```

### 3. build/webpack.dev.conf.js
dev中增加HtmlWebpackPlugin的配置，相当于为每一个入口模块增加一个HtmlWebpackPlugin配置
```bash
var pages = utils.getEntry(utils.getHtmlPath())
for (var pathname in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    minify: { // 传递 html-minifier 选项给 minify 输出
      removeComments: true
    },
    inject: 'body', // js插入位置
    chunks: [pathname, 'vendor', 'manifest'] // 每个html引用的js模块，也可以在这里加上vendor等公用模块
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
```
dev中删除单页面index.html的相关配置
```bash
//代码片段一：
historyApiFallback: {
  rewrites: [
    { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
  ],
}
//代码片段二：
new HtmlWebpackPlugin({
  filename: 'index.html',
  template: 'index.html',
  inject: true
})
```
### 3. build/webpack.prod.conf.js
build中增加HtmlWebpackPlugin的配置，相当于为每一个入口模块增加一个HtmlWebpackPlugin配置
```bash
var pages = utils.getEntry(utils.getHtmlPath())
for (var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], // 模板路径
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 比如包含两个模块（a和b），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item !== page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
```
build中删除单页面index.html的相关配置
```bash
new HtmlWebpackPlugin({
  filename: config.build.index,
  template: 'index.html',
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  },
  // necessary to consistently work with multiple chunks via CommonsChunkPlugin
  chunksSortMode: 'dependency'
})
```
## Dev Setup
> npm run dev
```
本例demo中有一下几个可访问URL（注意端口可能会变化）：
http://localhost:8081/page/page1.html （页面一）
http://localhost:8081/page/page1.html#/test （页面一内部的单页面结构）
http://localhost:8081/page/page2.html （页面二）
```

## Build Setup

> npm run build

```
需要修改config/index.js中build的配置
assetsPublicPath: '../' 
```

## Demo

> page1.html
> 
[page1](https://hustwxw.github.io/Vue-MultiplePage/dist/page/page1.html])
> page1.html#Test
> 
[page1#Test](https://hustwxw.github.io/Vue-MultiplePage/dist/page/page1.html#Test])
> page2
> 
[page2](https://hustwxw.github.io/Vue-MultiplePage/dist/page/page2.html])
