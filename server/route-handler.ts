import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, z } from "zod";
import express from "express";
import expressCore from "express-serve-static-core";
import { BAD_REQUEST_RESPONSE, APIResponse, makeResponder, INTERNAL_SERVER_ERROR_RESPONSE } from "./response";
import { SchemaArr, SchemaObj } from "./schema";
import { httpResponseStatus } from "./http";

type Request = express.Request;
type Response = express.Response;
type RouteParameters = expressCore.ParamsDictionary;

export class RouteHandler<
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
> {
    readonly description: string
    readonly requestSchema: SchemaObj<A,B,C,D>;
    readonly responseSchema: SchemaObj<E,F,G,H> | SchemaArr<G, "many"> | undefined;
    readonly paramsSchema: SchemaObj<I,J,K,L> | undefined;
    readonly querySchema: SchemaObj<M,N,O,P> | undefined;
    readonly handler: (request: D, params?: L, query?: P) => Promise<APIResponse<H>>

    constructor(args: {
        description: string,
        request: SchemaObj<A,B,C,D>,
        response?: SchemaObj<E,F,G,H> | SchemaArr<G, "many">, 
        params?: SchemaObj<I,J,K,L>,
        query?: SchemaObj<M,N,O,P>,
        handler: (request: D, params?: L, query?: P) => Promise<APIResponse<H>>
    }){
        this.description = args.description;
        this.requestSchema = args.request;
        this.responseSchema = args.response;
        this.paramsSchema = args.params;
        this.querySchema = args.query;
        this.handler = args.handler;
    }
    async handle(request: Request, response: Response) {
        const rawRequest : Request | undefined = request;
        const responder = makeResponder<H|undefined>(response);
        // 1. parse request body
        const parseRequestBodyResult = this.requestSchema.safeParse(rawRequest.body);
        if (!parseRequestBodyResult.success) {
            console.error(parseRequestBodyResult.error.message);
            return responder.respond(BAD_REQUEST_RESPONSE("Request does not match schema. Please see OPTIONS response."));
        }
        // 2. parse request params
        let params : L | undefined;
        if (this.paramsSchema) {
            const parseRequestParamsResult = this.paramsSchema.safeParse(request.params);
            if (parseRequestParamsResult.success) {
                params = parseRequestParamsResult.data;
            } else {
                return responder.respond(BAD_REQUEST_RESPONSE("Params do not match schema. Please see OPTIONS response."));
            }
        }
        // 3. parse request query, but only if present in request
        let query : P | undefined;
        if (Object.keys(request.query).length > 0 && this.querySchema) {
            const parseRequestQueryResult = this.querySchema.safeParse(request.query);
            if (parseRequestQueryResult.success) {
                query = parseRequestQueryResult.data;
            } else {
                return responder.respond(BAD_REQUEST_RESPONSE("Query does not match schema. Please see OPTIONS response."));
            }
        } else if (Object.keys(request.query).length > 0 && !this.querySchema) {
            return responder.respond(BAD_REQUEST_RESPONSE("This route does not accept queries. Please see OPTIONS response."));
        }
        // run the handler
        const result = await this.handler(parseRequestBodyResult.data, params, query);
        // parse result (verify against schema) if success response & respond
        if (this.responseSchema && ([httpResponseStatus.OK, httpResponseStatus.CREATED, httpResponseStatus.NO_CONTENT] as number[]).includes(result.status)) {
            const parseResponseData = this.responseSchema.safeParse(result.data);
            if (parseResponseData.success) {
                return responder.respond(result);
            } else {
                console.error("Success response does not match schema.");
                return responder.respond(INTERNAL_SERVER_ERROR_RESPONSE("Something went wrong in response."));
            }    
        } else {
            return responder.respond(result); 
        }
    }
}


export type AnyRouteHandller<
    TReq = any, 
    TRes = any, 
    TParams = any, 
    TQry = any
    > = RouteHandler<
        ZodRawShape, 
        UnknownKeysParam, 
        ZodTypeAny, 
        TReq, 
        
        ZodRawShape, 
        UnknownKeysParam, 
        ZodTypeAny, 
        TRes, 
        
        ZodRawShape, 
        UnknownKeysParam, 
        ZodTypeAny, 
        TParams, 
        
        ZodRawShape, 
        UnknownKeysParam, 
        ZodTypeAny, 
        TQry
>;


export function makeRouteHandler<
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
    P  
>(...args: ConstructorParameters<typeof RouteHandler< A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P >>) {
        return new RouteHandler(...args);
}
