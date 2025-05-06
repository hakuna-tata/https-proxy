## 本地转发 HTTPS 请求代理工具

工具本地验证：
- 根目录执行 npm link
- 根目录执行 node ./example/server.js
- 全局执行 proxy 8080/api
- 浏览器打开链接验证: https://localhost:8989/api