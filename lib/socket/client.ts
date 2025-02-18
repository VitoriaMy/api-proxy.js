import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { encryptData, decryptData } from "./unit";
import { Router } from "express";
import type { Request } from "express";
import bodyParser from 'body-parser';

function createSocket({
    clientToken,
    proxyHost,
    secretKey,
}: {
    clientToken: string,
    proxyHost: string,
    secretKey: string,
}) {

    const socketToken = encryptData(clientToken, secretKey);
    const socket = io(proxyHost, {
        extraHeaders: {
            "token": socketToken.data,
            "timeStamp": String(socketToken.timeStamp),
        },
    });

    const socketState = {
        socket,
        connect: false,
    }

    socket.on("connect", async () => {
        socket.on("connect", () => {
            console.log('client connected to proxy:', proxyHost);
        });
        socketState.connect = true;
    });

    return socketState
}


async function ajax(action: any, secretKey: string, socketState: {
    socket: Socket,
    connect: boolean,
}) {

    if (!socketState.connect) {
        return {
            error: "socket not connect",
        }
    }

    return await new Promise((resolve) => {
        socketState.socket.emit("query", encryptData(action, secretKey), ({
            data,
            timeStamp
        }: {
            data: string,
            timeStamp: number
        }) => {
            resolve({
                data: decryptData(data, timeStamp, secretKey),
            });
        });
    });

}



export default function ({
    limit = '1mb',
    clientToken,
    proxyHost,
    secretKey,
}: {
    limit?: string,
    clientToken: string,
    proxyHost: string,
    secretKey: string,
}, actionHandler: (req: Request) => Promise<any>) {

    const socketState = createSocket({
        clientToken,
        proxyHost,
        secretKey
    });
    const router = Router();
    router.use(bodyParser.json({
        limit
    }));
    router.use(bodyParser.urlencoded({ extended: true }));

    router.use(async (req, res) => {

        if (actionHandler) {
            const actions = await actionHandler(req);
            const result = await ajax(actions, secretKey, socketState);
            res.json(result);
        } else {
            res.status(404).json({
                error: "callback not found",
            });
        }
    });
    return router;
};
