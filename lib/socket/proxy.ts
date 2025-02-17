import { Server } from "socket.io";
import { decryptData } from "./unit";
import type { Server as HttpServer } from "http";
import type { Socket } from "socket.io";


const socketStore = {
    server: null,
} as {
    server: Socket | null,
}


function checkToken(socket: Socket, {
    clientToken,
    serverToken,
    secretKey,
}: {
    clientToken: string,
    serverToken: string,
    secretKey: string,
}) {
    const {
        token: tokenStr,
        timeStamp,
        timestamp,
    } = socket.handshake?.headers || {};




    const _timestamp = Number(timeStamp || timestamp);

    if (typeof tokenStr !== 'string' || isNaN(_timestamp)) {
        socket.disconnect();
        return false;
    }

    const { data: token } = decryptData(tokenStr, _timestamp, secretKey);

    switch (token) {
        case serverToken:
            if (socketStore.server) {
                socketStore.server.disconnect();
            }
            socketStore.server = socket;
            return false;
        case clientToken:
            return true;
        default:
            socket.disconnect();
            return false;
    }
}

function response(data: string, timeStamp: number, callback: (e: any) => void) {
    // 判断是否有callback
    if (!callback) return;
    // 判读请求是否超时， 超时时间为30s
    if (!socketStore.server) {
        callback({
            code: 500,
            message: "服务端未连接",
            data: null,
        });
        return;
    }
    // 发送请求
    socketStore.server.emit("query", { data, timeStamp }, callback);
}


export default function ({
    clientToken,
    serverToken,
    secretKey,
}: {
    clientToken: string,
    serverToken: string,
    secretKey: string,
}, server: HttpServer) {
    const io = new Server(server);
    io.on("connection", (socket) => {
        if (!checkToken(socket, {
            clientToken,
            serverToken,
            secretKey,
        })) return;
        socket.on("query", ({
            data,
            timeStamp,
        }, callback) => {
            response(data, timeStamp, callback);
        });
    });

    return io;

}