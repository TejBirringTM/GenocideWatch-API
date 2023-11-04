import * as edgedb from "edgedb";
import queryBuilder from "../dbschema/edgeql-js";
// import configs from "../configs";
// import https from "node:https";
// import fs from "node:fs";

// const rootCA = fs.readFileSync(".credentials/certs/rootCA.crt");
// const intermediateCA1 = fs.readFileSync(".credentials/certs/intermediateCA1.crt");
// const intermediateCA2 = fs.readFileSync(".credentials/certs/intermediateCA2.crt");
// const cert = fs.readFileSync(".credentials/certs/cert.crt");

// https.globalAgent.options.ca = [rootCA, intermediateCA1, intermediateCA2];
// https.globalAgent.options.cert = cert


export const c = edgedb.createClient(
    // {
    //     dsn: configs.db,
    // }
);
export const e = queryBuilder;

export { $expr_PathNode } from "../dbschema/edgeql-js/path";