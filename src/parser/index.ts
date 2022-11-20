import { readFileSync, stat } from "fs";

const USE_STATEMENT = RegExp("USE (.*?) AS ([A-Z _]{1,})")
const DEF_STATEMENT = RegExp("([A-Z _]{1,}): ?(\\w+) ?= ?(.*)");
const ASS_STATEMENT = RegExp("([A-Z _]{1,}) ?= ?(.*)");

const readFile = (filename: string) => {
    if (filename.toUpperCase().endsWith('.JSON')) return JSON.parse(readFileSync(filename, {encoding: "utf-8"}));
    return null;
}
const parseVal = (type: string, val: string) => {
    if (type === "string" && (val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\'')))
        return JSON.parse(val);
    if (type === "number") return parseInt(val);
    if (type === "boolean" || type === "bool") return JSON.parse(val.toLowerCase());
    if (type === "json") return JSON.parse(val);
    if (type === "auto") return eval(val);
}

const parseStatement: (statement: string) => { [key: string]: any } = (statement) => {
    if (USE_STATEMENT.test(statement)){
        const [_, filename, varname] = statement.match(USE_STATEMENT)!;
        return { [varname]: readFile(filename) }
    }
    else if (DEF_STATEMENT.test(statement)){
        const [_, varname, vartype, value] = statement.match(DEF_STATEMENT)!;
        return { [varname]: parseVal(vartype.trim(), value.trim()) }
    }
    else if (ASS_STATEMENT.test(statement)){
        const [_, varname, value] = statement.match(ASS_STATEMENT)!;
        return { [varname]: JSON.parse(value) }
    }

    return {}
}

export const ParseString = (data: string) => {
    const statements = data.split('\n');
    const resolved = statements.map(statement => parseStatement(statement.trim())).reduce((agg, curr) => ({...agg, ...curr}));

    return (resolved as any);
}