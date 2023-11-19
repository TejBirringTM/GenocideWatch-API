
import { BAD_REQUEST_RESPONSE, INTERNAL_SERVER_ERROR_RESPONSE, NOT_FOUND_RESPONSE, SUCCESS_RESPONSE, makeRouteHandler } from "../../server";
import { User } from "../../model/user"
import { z } from "zod";
import { c, e } from "../../libs/edgedb";
import auth from "../../libs/firebase-auth";
import { UUID } from "../../model/common";
import { AnyRoute } from "../../server/route";

const createUser = makeRouteHandler({
    description: "Make a user account.",
    request: User.omit({id: true, role: true}).merge(z.object({
        password: z.string().min(8)
    })),
    response: z.object({
        id: UUID
    }),    
    minimumUserRole: "Public",
    async handler(request, params, query) {
        try {
            // ensure no account exists with this email
            let dbEntry = await e.select(e.User, (user)=>({
                filter_single: e.op(user.email, "=", request.email)
            })).run(c);
            if (dbEntry) {
                return BAD_REQUEST_RESPONSE(`Failed to create user. Email already exists: ${request.email}`);
            }
            // create entry in db
            dbEntry = await e.insert(e.User, {
                name: request.name,
                role: "User",
                email: request.email
            }).run(c);
            // create entry in firebase auth server
            await auth.createUser({
                uid: dbEntry.id,
                displayName: request.name,
                email: request.email,
                password: request.password
            })
            // return success
            return SUCCESS_RESPONSE(`Created user: ${request.email}`, {
                id: dbEntry.id
            });
        } catch (e) {
            console.error(`Auth error:\n`, e);
            return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to create user: ${request.email}`);
        }
    },
});

const readUser = makeRouteHandler({
    description: "Read a user account.",
    request: z.object({}),
    response: User,
    params: z.object({
        id: UUID
    }),
    minimumUserRole: "User",
    async handler(request, params, query) {
        // @ts-ignore
        const id = params.id;
        try {
            const dbResponse = await e.select(e.User, () => ({
                ...e.User["*"],
                filter_single: {
                    id
                }
            })).run(c);
            if (!dbResponse) {
                return NOT_FOUND_RESPONSE(`User not found: ${id}`)
            } 
            return SUCCESS_RESPONSE(`User found: ${id} (${dbResponse.email})`, {
                id: dbResponse.id,
                name: dbResponse.name,
                email: dbResponse.email,
                role: dbResponse.role
            });
        } catch (e) {
            console.error(`Auth error:\n`, e);
            return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to read user: ${id}`);            
        }
    }
});

const deleteUser = makeRouteHandler({
    description: "Delete a user account.",
    request: z.object({}),
    response: z.object({
        id: UUID
    }),
    params: z.object({
        id: UUID
    }),
    minimumUserRole: "User",
    async handler(request, params, query) {
        // @ts-ignore
        const id = params.id;
        // check if already marked for deletion
        try {
            const dbEntry = await e.select(e.User, (user)=>({
                filter_single: e.op(
                    e.op(user.id, "=", e.uuid(id)),
                    "and",
                    e.op(user.awaitingDeletion, "=", true)
                )
            })).run(c);
            if (dbEntry) {
                return SUCCESS_RESPONSE(`User already deleted: ${id}`, {
                    id: dbEntry.id
                });
            }
        } catch (e) {
            console.error(`Auth error:\n`, e);
            return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to delete user: ${id}`);
        }
        // otherwise, mark for deletion
        try {
            const dbResponse = await e.update(e.User, (user) => ({
                filter_single: {
                  id 
                },
                set: {
                    awaitingDeletion: true
                }
            })).run(c);
            if (!dbResponse) {
                return NOT_FOUND_RESPONSE(`User not found: ${id}`)
            } 
            return SUCCESS_RESPONSE(`User deleted: ${id}`, {
                id: dbResponse.id
            });
        } catch (e) {
            console.error(`Auth error:\n`, e);
            return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to delete user: ${id}`);
        }     
    },
});

export const userRoutes : AnyRoute[] = [
    {
        method: "POST",
        path: "user",
        handler: createUser
    },
    {
        method: "GET",
        path: "user/:id",
        handler: readUser
    },
    {
        method: "DELETE",
        path: "user/:id",
        handler: deleteUser
    }
];