import { createServer } from "../dist/proxy-js.js";
// import createServer from "../lib/socket2/server.js";


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

        return {
            code: 200,
            message: "success",
            data: {
                actions,
            }
        }
    });
}