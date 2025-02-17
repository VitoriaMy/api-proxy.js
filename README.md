[中文版](./readme_zh.md)

# api-proxy.js

![npm](https://img.shields.io/npm/v/api-proxy.js)
![license](https://img.shields.io/npm/l/api-proxy.js)
![downloads](https://img.shields.io/npm/dt/api-proxy.js)

## Introduction

api-proxy.js is a proxy service used to forward external API requests to the internal network and return the response.

## Service Overview

| Service | Name          | Deployment Location | Function                                           |
| ------- | ------------- | ------------------- | -------------------------------------------------- |
| proxy   | Proxy Service | External Server     | Forwards external API requests to the internal network and returns the response |
| server  | Internal Request Service | Internal Server | Used to request internal API services              |
| client  | External Access Service | Request Service   | Receiving end of external access API services      |

---

## Installation

Install using npm:

```bash
npm install api-proxy.js
```

## Configuration

```json
{
 "clientToken": "client",  // client, proxy
 "proxyPort": 8000, // proxy
 "proxyHost": "http://localhost:8000",    // client, server
 "secretKey": "123456",    // client, server, proxy
 "serverToken": "server" // server, proxy
}
```

## Usage

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
           // actions from client

           // do something ...

           return {
               // response
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
              // actions to client
           }

       }));

       app.listen(8008, () => {
           console.log('client is running at http://localhost:8008');
       });
   }
   ```
````
