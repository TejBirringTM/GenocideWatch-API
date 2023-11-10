import { UnknownKeysParam, ZodRawShape, ZodTypeAny } from "zod";
import { $expr_PathNode } from "../../libs/edgedb";
import { SchemaObj } from "../../server/schema";
import { createEntityControllers } from "./crudl-controllers-factory";
import { AnyRoute } from "../../server/route";

export function createEntityRoutes<
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
    const entityControllers = createEntityControllers(
        entityName,
        entityDBSchema,
        entityParseSchema,
        controllers
    );

    const routes : AnyRoute[] = [];
    const lowercaseEntityName = entityName.toLowerCase();

    if (entityControllers.create) {
        routes.push(
            {
                method: "POST",
                path: lowercaseEntityName,
                handler: entityControllers.create
            },            
        )
    }

    if (entityControllers.read) {
        routes.push(
            {
                method: "GET",
                path: lowercaseEntityName + "/:id",
                handler: entityControllers.read
            }
        )        
    }

    if (entityControllers.update) {
        routes.push(
            {
                method: "PATCH",
                path: lowercaseEntityName + "/:id",
                handler: entityControllers.update
            }
        )
    }

    if (entityControllers.delete) {
        routes.push(
            {
                method: "DELETE",
                path: lowercaseEntityName + "/:id",
                handler: entityControllers.delete
            }
        )
    }

    if (entityControllers.list) {
        routes.push(
            {
                method: "GET",
                path: lowercaseEntityName,
                handler: entityControllers.list
            },        
        )        
    }

    return routes;
}
