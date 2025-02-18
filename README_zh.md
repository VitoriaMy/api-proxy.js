[English Version](./README.md)

# api-proxy.js

![npm](https://img.shields.io/npm/v/proxy-js)
![license](https://img.shields.io/npm/l/proxy-js)
<!-- ![downloads](https://img.shields.io/npm/dt/proxy-js) -->

## 简介

api-proxy.js 是一个用于将外部 API 请求转发到内网并返回响应的代理服务。

## 服务概览

| 服务   | 名称         | 部署位置   | 功能                                              |
| ------ | ------------ | ---------- | ------------------------------------------------- |
| proxy  | 代理服务     | 外网服务器 | 将外部 API 请求转发到内网，并将响应结果原路返回     |
| server | 内网请求服务 | 内网服务器 | 用于请求内网 API 服务                               |
| client | 外部访问服务 | 请求服务   | 外部访问 API 服务的接收端                           |

---

## 安装

使用 npm 安装：

```bash
npm install api-proxy.js
```

## 配置

```json
{
 "clientToken": "client",  // 客户端, 代理
 "proxyPort": 8000, // 代理
 "proxyHost": "http://localhost:8000",    // 客户端, 服务器
 "secretKey": "123456",    // 客户端, 服务器, 代理
 "serverToken": "server" // 服务器, 代理
}
```

## 使用

1. proxy

   ```js
   import { createProxy } from "../dist/api-proxy.js";
   import express from 'express';

   export default function (config = {}) {
       const {
           clientToken,
           proxyHost,
           secretKey,
           proxyPort
       } = config;

       const app = express();

       app.use(createProxy({
           clientToken,
           proxyHost,
           secretKey,
       }));

       app.listen(proxyPort, () => {
           console.log(`proxy is running at http://localhost:${proxyPort}`);
       });
   }
   ```
2. server

   ```js
   import { createServer } from "../dist/api-proxy.js";

   export default function (config = {}) {
       const {
           serverToken,
           proxyHost,
           secretKey,
       } = config;

       createServer({
           serverToken,
           proxyHost,
           secretKey,
       }, async (actions) => {
           // 来自客户端的操作

           // 执行某些操作...

           return {
               // 响应
           }
       });
   }
   ```
3. client

   ```js
   import { createClient } from "../dist/api-proxy.js";
   import express from 'express';

   export default function (config = {}) {
       const {
           clientToken,
           proxyHost,
           secretKey,
       } = config;

       const app = express();

       app.use(createClient({
           clientToken,
           proxyHost,
           secretKey,
       }, req => {

           // ...

           return {
              // 返回给客户端的操作
           }

       }));

       app.listen(8008, () => {
           console.log('client is running at http://localhost:8008');
       });
   }
   ```
