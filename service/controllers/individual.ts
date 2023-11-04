import { z } from "zod";
import { INTERNAL_SERVER_ERROR_RESPONSE, SUCCESS_RESPONSE, makeRouteHandler } from "../../server";
import { c, e } from "../../libs/edgedb";
import { create } from "../utils/crudl";

// type Individual extending Base, OnlinePresence {
//     required name: str;
//     link authored := .<authors[is Evidence];
// }
// type Base {
//     notes: array<str>;
//     multi tags: str;
// }

// type OnlinePresence {
//     linkedIn: str;
//     instagram: str;
//     facebook: str;
//     twittter: str;
//     website: str;
//     email: str;
//     rumble: str;
//     locals: str;
//     patreon: str;
// }

export const createIndividual = makeRouteHandler({
    description: "test",
    request: z.object({
        name: z.string().min(1),
        notes: z.string().array().optional(),
        tags: z.string().min(1).array().optional()
    }),
    response: z.object({
        id: z.string().min(1)
    }),
    async handler(request, param, query) {
        return create("Individual", e.Individual, {
            name: request.name,
            notes: request.notes && e.literal(e.array(e.str), request.notes),
            tags: request.tags && e.literal(e.array(e.str), request.tags)
        });
    },
})