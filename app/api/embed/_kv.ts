// lib/kv.js
import { kv } from "@vercel/kv";

const localMock = new Map();
const isLocalStorage = process.env.NODE_ENV === "development";
console.log(`Using ${isLocalStorage ? "local mock KV" : "Vercel KV"}`);

export const storage = isLocalStorage
  ? {
      get: async (key: string) => {
        return localMock.get(key) || null;
      },
      set: async (key: string, value: any, options?: any) => {
        localMock.set(key, value);

        if (options?.ex) {
          setTimeout(() => localMock.delete(key), options.ex * 1000);
        }
        return "OK";
      },
      del: async (key: string) => {
        return localMock.delete(key) ? 1 : 0;
      },
    }
  : kv;
