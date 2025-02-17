import { createClient } from "../dist/proxy-js.js";
// import createClient from "../lib/socket2/client.js";

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
        const {
            headers,
            method,
            url,
            body,
            query,
            params,
            cookies,
        } = req;

        return {
            headers,
            method,
            url,
            body,
            query,
            params,
            cookies
        }

    }));

    app.listen(8008, () => {
        console.log('client is running at http://localhost:8008');
    });
}