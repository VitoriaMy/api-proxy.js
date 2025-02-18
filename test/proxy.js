import { createProxy } from "../dist/proxy-js.js";
// import createProxy from "../lib/socket2/proxy.js";
import { createServer } from "http";


export default function (config = {}) {

    const {
        clientToken,
        serverToken,
        secretKey,
    } = config;

    const server = createServer();

    createProxy({
        clientToken,
        serverToken,
        secretKey,
    }, server);

    server.listen(8000, () => {
        console.log(`proxy is running at http://localhost:${8000}`);
    });
}