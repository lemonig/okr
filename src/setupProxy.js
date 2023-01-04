const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // 指定需要转发的请求
    createProxyMiddleware({
      // target: "http://192.168.188.179:3429", //服务器的地址
      target: "https://portal.greandata1.com/", //服务器的地址
      changeOrigin: true,
      // pathRewrite(path) {
      //   return path.replace('/api', '');
      // }
    })
  );
};
