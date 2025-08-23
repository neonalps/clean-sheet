import { decode } from "@src/app/util/base64";

export function parseJwt(jwt: string): Record<string, any> {
    const parts = jwt.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid token passed");
    }

    return JSON.parse(decode(parts[1]));
}