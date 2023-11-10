import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, z } from "zod";
import { BAD_REQUEST_RESPONSE, NOT_IMPLEMENTED_RESPONSE, makeRouteHandler } from "../../server";
import { $expr_PathNode, c, e } from "../../libs/edgedb";
import { SchemaObj } from "../../server/schema";
import { UUID } from "../../model/common";
import { create, list, read, remove, update } from "./crudl";

// const unimplementedController = makeRouteHandler({
//     description: "",
//     request: z.object({}),
//     response: z.object({}),
//     async handler(request, params, query) {
//         return NOT_IMPLEMENTED_RESPONSE("");
//     },
// })

export function createEntityControllers<
    A extends ZodRawShape,
    B extends UnknownKeysParam,
    C extends ZodTypeAny,
    D,
    Root extends $expr_PathNode
>(
    entityName: string,
    entityDBSchema: Root,
    entityParseSchema: SchemaObj<A, B, C, D>,
    controllers: {
        create?: boolean,
        read?: boolean,
        update?: boolean,
        delete?: boolean,
        list?: boolean,
    }
) {
    // CREATE
    const createCntrl = makeRouteHandler({
        description: "",
        request: <any>entityParseSchema.omit({id: true}),
        response: z.object({
            id: UUID
        }),
        async handler(request, param, query) {
            return await create(entityName, entityDBSchema, request);
        },
    });
    // READ
    const readCntrl = makeRouteHandler({
        description: "",
        request: z.object({}),
        response: entityParseSchema,
        params: z.object({
            id: UUID
        }),
        async handler(request, params, query) {
            if (!params?.id) {
                return BAD_REQUEST_RESPONSE("An id is required.");
            } else {
                return await read(entityName, entityDBSchema, params?.id);
            }
        },
    });    
    // UPDATE
    const updateCntrl = makeRouteHandler({
        description: "",
        request: <any>entityParseSchema.omit({id: true}).partial(),
        response: z.object({
            id: UUID
        }),
        params: z.object({
            id: UUID
        }),
        async handler(request, params, query) {
            if (!params?.id) {
                return BAD_REQUEST_RESPONSE("An id is required.");
            } else {
                return await update("Individual", entityDBSchema, params?.id, request);
            }
        },    
    });
    // DELETE
    const delCntrl = makeRouteHandler({
        description: "",
        request: z.object({}),
        response: z.object({
            id: UUID
        }),
        params: z.object({
            id: UUID
        }),
        async handler(request, params, query) {
            if (!params?.id) {
                return BAD_REQUEST_RESPONSE("An id is required.");
            } else {
                return await remove("Individual", entityDBSchema, params?.id);
            }        
        },
    });
    // LIST
    const listCntrl = makeRouteHandler({
        description: "",
        request: z.object({}),
        response: entityParseSchema.array(),
        async handler(request, params, query) {
            return list("Individual", entityDBSchema);
        },
    });    
    // Return:
    return {
        create: controllers.create ? createCntrl : undefined,
        read: controllers.read ? readCntrl : undefined,
        update: controllers.update ? updateCntrl : undefined,
        delete: controllers.delete ? delCntrl : undefined,
        list: controllers.list ? listCntrl : undefined
    }
}
