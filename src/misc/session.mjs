// note - from the example provided at https://github.com/lazarv/react-server
import { randomBytes } from "node:crypto";

export const cookieName = "loginSession";
export const password = randomBytes(32).toString("hex");
