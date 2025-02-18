import type { Server as HttpServer } from 'http';
import type { Request, Router } from "express";

interface ProxyOptions {
    clientToken: string;
    serverToken: string;
    secretKey: string;
}
export function createProxy(options: ProxyOptions, server: HttpServer): void;

interface ServerOptions {
    proxyHost: string,
    serverToken: string,
    secretKey: string,
}


export function createServer(options: ServerOptions, query: (actions: any) => Promise<any>): void;


interface ClientOptions {
    limit?: string;
    clientToken: string;
    proxyHost: string;
    secretKey: string;
}

export function createClient(options: ClientOptions, actionHandler: (req: Request) => Promise<any>): Router;