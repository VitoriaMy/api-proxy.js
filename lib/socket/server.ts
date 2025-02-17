import { io } from "socket.io-client";
import { encryptData, decryptData } from "./unit";

export default function ({
    proxyHost,
    serverToken,
    secretKey,
}: {
    proxyHost: string,
    serverToken: string,
    secretKey: string,
}, query: (actions: any) => Promise<any>) {
    const socketToken = encryptData(serverToken, secretKey);
    const socket = io(proxyHost, {
        extraHeaders: {
            "token": socketToken.data,
            "timeStamp": String(socketToken.timeStamp),
        },
    });

    socket.on("connect", () => {
        console.log('server connected to proxy:', proxyHost);
    });

    socket.on("query", async ({
        data,
        timeStamp
    }, callback) => {
        const {
            data: actions,
        } = decryptData(data, timeStamp, secretKey);
        const res = query ? await query(actions) : {
            code: 400,
            message: 'server is not a ready',
        }
        callback(encryptData(res, secretKey));
    });

}