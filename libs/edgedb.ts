import * as edgedb from "edgedb";
import queryBuilder from "../dbschema/edgeql-js";

export const c = edgedb.createClient();
export const e = queryBuilder;

export { $expr_PathNode } from "../dbschema/edgeql-js/path";