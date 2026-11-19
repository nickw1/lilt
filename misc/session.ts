// note - from the example provided at https://github.com/lazarv/react-server
import { randomBytes } from "node:crypto";
import { getIronSession, webCookies, type SessionOptions } from 'iron-session';
import { getPendingResponseHeaders } from "tinyrsc/server";
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

console.log("###### Initialising session.ts ######");
export const cookieName = "loginSession";
export const password = process.env.SESSION_PASS as SessionOptions["password"];

export async function getSession<T extends object>(request: Request) {
    console.log("getSession(): headers: ", getPendingResponseHeaders());
    return await getIronSession<T>(webCookies(request, getPendingResponseHeaders()!), { cookieName, password, ttl: 3600 });
}

export async function getSessionFromExpress<T extends object>(request: ExpressRequest, response: ExpressResponse) {
     return await getIronSession<T>(request, response, { cookieName, password, ttl: 3600 });
}