import { UnknownKeysParam, ZodRawShape, ZodTypeAny } from "zod";
import { RouteHandler } from "./route-handler";
import { HttpRequestMethod } from "./http";


export type Route<
    A extends ZodRawShape,
    B extends UnknownKeysParam,
    C extends ZodTypeAny,
    D,
    E extends ZodRawShape,
    F extends UnknownKeysParam,
    G extends ZodTypeAny,
    H,
    I extends ZodRawShape,
    J extends UnknownKeysParam,
    K extends ZodTypeAny,
    L,
    M extends ZodRawShape,
    N extends UnknownKeysParam,
    O extends ZodTypeAny,
    P,    
> = {
    method: HttpRequestMethod,
    path: string,
    handler: RouteHandler<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>
};


export type AnyRoute<TReq = any, TRes = any, TParams = any, TQry = any> = Route<
    ZodRawShape, UnknownKeysParam, ZodTypeAny, TReq,
    ZodRawShape, UnknownKeysParam, ZodTypeAny, TRes,
    ZodRawShape, UnknownKeysParam, ZodTypeAny, TParams,
    ZodRawShape, UnknownKeysParam, ZodTypeAny, TQry
>;
