/*
    Exports a factory function to create CRUDL routes.
*/
import { UnknownKeysParam, ZodRawShape, ZodTypeAny, z } from "zod";
import { $expr_PathNode, c, e } from "../../libs/edgedb";
import { BAD_REQUEST_RESPONSE, INTERNAL_SERVER_ERROR_RESPONSE, NOT_FOUND_RESPONSE, NOT_IMPLEMENTED_RESPONSE, SUCCESS_RESPONSE, makeRouteHandler } from "../../server";
import { AnyRoute } from "../../server/route";
import { SchemaObj } from "../../server/schema";
import { UUID } from "../../model/common";
import { kebabCase } from 'case-anything'

const ERROR_NO_RESPONSE_FROM_DB = new Error("No response from database.");
const ERROR_INVALID_RESPONSE_FROM_DB = new Error("Invalid response from database.");

export function createCRUDLRoutes<
    TDBSchema extends $expr_PathNode,
    A extends ZodRawShape,
    B extends UnknownKeysParam,
    C extends ZodTypeAny,
    D,
>(
    dbSchema: TDBSchema,
    parseSchema: SchemaObj<A,B,C,D>,
    specification: {
        create?: (request: Omit<D, "id">)=>Promise<any>,
        read?: true,
        update?: (id: string, request: Partial<Omit<D, "id">>)=>Promise<any>,
        delete?: true,
        list?: true,
    }
) : AnyRoute[] {
    const entityPath = dbSchema.__element__.__name__;
    const entityPathComponents = entityPath.split("::");
    const entityName = entityPathComponents[entityPathComponents.length-1];
    const entitySlug = kebabCase(entityName);
    const routes : AnyRoute[] = [];

    // CREATE Route
    routes.push({
        method: "POST",
        path: entitySlug,
        handler: makeRouteHandler({
            description: ``,
            request: <any>parseSchema.omit({id: true}), // TODO: fix typing
            response: z.object({
                id: UUID
            }),
            async handler(request, params, query) {
                if (!specification.create) {
                    return NOT_IMPLEMENTED_RESPONSE("");
                } else {
                    try {
                        const dbResponse = await specification.create(request);
                        console.info(`Database response:\n`, dbResponse);
                        if (!dbResponse?.id) {
                            throw ERROR_INVALID_RESPONSE_FROM_DB;
                        }
                        return SUCCESS_RESPONSE(`Created: ${entityName}`, {
                            id: dbResponse.id
                        });
                    } catch (e) {
                        console.error(`Database error:\n`, e);
                        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to create: ${entityName}`);
                    }
                }
            }
        })
    });

    // READ Route
    routes.push({
        method: "GET",
        path: entitySlug + "/:id",
        handler: makeRouteHandler({
            description: ``,
            request: z.object({}),
            response: z.object({}),
            params: z.object({
                id: UUID
            }),
            async handler(request, params, query) {
                if (!specification.read) {
                    return NOT_IMPLEMENTED_RESPONSE("");
                }
                else if (!params?.id) {
                    return BAD_REQUEST_RESPONSE("An id is required.");
                } else {
                    const id = params.id;
                    try {
                        const response = (await c.query(`SELECT ${entityPath} {**} FILTER .id = <uuid>'${id}'`))?.[0];
                        console.info(`Database response:\n`, response);
                        if (!response) {
                            return NOT_FOUND_RESPONSE(`Not found: ${entityName} (${id})`);
                        } else {
                            return SUCCESS_RESPONSE(`Read: ${entityName} (${id})`, response);
                        }                        
                    } catch (e) {
                        console.error(`Database error:\n`, e);
                        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to read: ${entityName} ${id}`);
                    }
                }
            }
        })
    })

    // UPDATE Route
    routes.push({
        method: "PATCH",
        path: entitySlug + "/:id",
        handler: makeRouteHandler({
            description: ``,
            request: <any>parseSchema.partial(), // TODO: fix typing
            response: z.object({}),
            params: z.object({
                id: UUID
            }),            
            async handler(request, params, query) {
                if (!specification.update) {
                    return NOT_IMPLEMENTED_RESPONSE("");
                } else if (!params?.id) {
                    return BAD_REQUEST_RESPONSE("An id is required.");
                } else {
                    const id = params.id;
                    try {
                        const dbResponse = await specification.update(id, request);
                        console.info(`Database response:\n`, dbResponse);
                        if (!dbResponse?.id) {
                            throw ERROR_INVALID_RESPONSE_FROM_DB;
                        }
                        return SUCCESS_RESPONSE(`Updated: ${entityName} (${id})`, {
                            id: dbResponse.id
                        });
                    } catch (e) {
                        console.error(`Database error:\n`, e);
                        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to update: ${entityName} (${id})`);
                    }
                }
            },
        })
    })

    // DELETE Route
    routes.push({
        method: "DELETE",
        path: entitySlug + "/:id",
        handler: makeRouteHandler({
            description: ``,
            request: z.object({}),
            response: z.object({
                id: UUID
            }),
            params: z.object({
                id: UUID
            }),
            async handler(request, params, query) {
                if (!specification.delete) {
                    return NOT_IMPLEMENTED_RESPONSE("");
                } else if (!params?.id) {
                    return BAD_REQUEST_RESPONSE("An id is required.");
                } else {
                    const id = params.id;
                    try {
                        const response = await e.delete(dbSchema, (obj) => ({
                            filter_single: {
                                id
                            }
                        }) as any).run(c);
                        console.info(`Database response:\n`, response);
                        if (response) {
                            return SUCCESS_RESPONSE(`Deleted: ${entityName} (${id})`, {
                                id
                            });
                        } else {
                            return SUCCESS_RESPONSE(`Already deleted: ${entityName} (${id})`, {
                                id
                            });
                        }
                    } catch (e) {
                        console.error(`Database error:\n`, e);
                        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to delete: ${entityName} (${id})`);
                    }
                }
            },
        })
    })

    // LIST Route
    routes.push({
        method: "GET",
        path: entitySlug,
        handler: makeRouteHandler({
            description: ``,
            request: z.object({}),
            response: z.any().array(),
            async handler(request, params, query) {
                if (!specification.list) {
                    return NOT_IMPLEMENTED_RESPONSE("");
                } else {
                    try {
                        const dbResponse = await c.query(`SELECT ${entityPath} {**}`);
                        console.info(`Database response:\n`, dbResponse);
                        if (!dbResponse) {
                            throw ERROR_NO_RESPONSE_FROM_DB;
                        } else if (dbResponse && !Array.isArray(dbResponse)) {
                            throw ERROR_INVALID_RESPONSE_FROM_DB;
                        } 
                        else {
                            return SUCCESS_RESPONSE(`Read: ${entityName}`, dbResponse);
                        }                        
                    } catch (e) {
                        console.error(`Database error:\n`, e);
                        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to read: ${entityName}`);
                    }
                }
            }
        })
    })

    // add OPTIONS route
    //

    // return
    return routes;
}
