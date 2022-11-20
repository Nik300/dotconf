import { ParseString } from "./parser";
import { readFileSync } from 'fs';

process.env = { ...process.env, ...ParseString(readFileSync("./.conf", { encoding: "utf-8" })) };

export default process.env;