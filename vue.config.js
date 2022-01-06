module.exports = {
  devServer:{
    port:8999, //端口号的配置
    open:true //自动打开浏览器
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js'
    }
  },
  lintOnSave: false // 关闭语法检查
}
