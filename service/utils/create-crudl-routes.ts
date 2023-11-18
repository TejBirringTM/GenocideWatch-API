/*
    Exports a factory function to create CRUDL routes.
*/
import { UnknownKeysParam, ZodRawShape, ZodTypeAny, z } from "zod";
import { $expr_PathNode, c, e } from "../../libs/edgedb";
import { INTERNAL_SERVER_ERROR_RESPONSE, NOT_FOUND_RESPONSE, SUCCESS_RESPONSE, makeRouteHandler } from "../../server";
import { AnyRoute } from "../../server/route";
import { SchemaObj } from "../../server/schema";
import { UUID } from "../../model/common";
import { kebabCase } from 'case-anything'
import { UserRole } from "../../server/roles";

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
        create?: {
            access: UserRole,
            transform: (request: Omit<D, "id">) => object
        },
        read?: {
            access: UserRole
        },
        update?: {
            access: UserRole,
            transform: (request: Partial<Omit<D, "id">>) => object
        },
        delete?: {
            access: UserRole
        },
        list?: {
            access: UserRole
        },
    }
) : AnyRoute[] {
    const entityPath = dbSchema.__element__.__name__;
    const entityPathComponents = entityPath.split("::");
    const entityName = entityPathComponents[entityPathComponents.length-1];
    const entitySlug = kebabCase(entityName);
    const routes : AnyRoute[] = [];

    // CREATE Route
    if (specification.create) {
        routes.push({
            method: "POST",
            path: entitySlug,
            minimumRole: specification.create.access,
            handler: makeRouteHandler({
                description: ``,
                request: <any>parseSchema.omit({id: true}), // TODO: fix typing
                response: z.object({
                    id: UUID
                }),
                async handler(request, params, query) {
                    try {
                        const createData = specification.create ? specification.create.transform(request) : request;
                        const dbResponse = await e.insert(dbSchema, createData).run(c);
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
            })
        });
    }

    // READ Route
    if (specification.read) {
        routes.push({
            method: "GET",
            path: entitySlug + "/:id",
            minimumRole: specification.read.access,
            handler: makeRouteHandler({
                description: ``,
                request: z.object({}),
                response: z.object({}),
                params: z.object({
                    id: UUID
                }),
                query: z.object({
                    deep: z.literal("true")
                }),
                async handler(request, params, query) {
                    // @ts-ignore
                    const id = params.id;
                    try {
                        let dbResponse;
                        if (query?.deep) {
                            dbResponse = (await c.query(`SELECT ${entityPath} {**} FILTER .id = <uuid>'${id}'`))?.[0];
                        } else {
                            dbResponse = (await c.query(`SELECT ${entityPath} {*} FILTER .id = <uuid>'${id}'`))?.[0];
                        }
                        console.info(`Database response:\n`, dbResponse);
                        if (!dbResponse) {
                            return NOT_FOUND_RESPONSE(`Not found: ${entityName} (${id})`);
                        } else {
                            return SUCCESS_RESPONSE(`Read: ${entityName} (${id})`, dbResponse);
                        }                        
                    } catch (e) {
                        console.error(`Database error:\n`, e);
                        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to read: ${entityName} ${id}`);
                    }
                }
            })
        });
    }

    // UPDATE Route
    if (specification.update) {
        routes.push({
            method: "PATCH",
            path: entitySlug + "/:id",
            minimumRole: specification.update.access,
            handler: makeRouteHandler({
                description: ``,
                request: <any>parseSchema.partial(), // TODO: fix typing
                response: z.object({}),
                params: z.object({
                    id: UUID
                }),            
                async handler(request, params, query) {
                    // @ts-ignore
                    const id = params.id;
                    try {
                        const updateData = specification.update ? specification.update.transform(request) : request;
                        const dbResponse = await e.update(dbSchema, ()=>({
                            filter_single: {
                                // @ts-ignore
                                id
                            },
                            set: updateData
                        })).run(c);
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
                },
            })
        });
    }

    // DELETE Route
    if (specification.delete) {
        routes.push({
            method: "DELETE",
            path: entitySlug + "/:id",
            minimumRole: specification.delete.access,
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
                    // @ts-ignore
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
                },
            })
        });
    }

    // LIST Route
    if (specification.list) {
        routes.push({
            method: "GET",
            path: entitySlug,
            minimumRole: specification.list.access,
            handler: makeRouteHandler({
                description: ``,
                request: z.object({}),
                response: z.any().array(),
                query: z.object({
                    deep: z.literal("true")
                }),
                async handler(request, params, query) {
                    try {
                        let dbResponse;
                        if (query?.deep) {
                            dbResponse = await c.query(`SELECT ${entityPath} {**}`)
                        } else {
                            dbResponse = await c.query(`SELECT ${entityPath} {*}`)
                        }
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
            })
        });
    }

    // add OPTIONS route
    //

    // return
    return routes;
}
