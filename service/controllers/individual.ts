import { c, e } from "../../libs/edgedb";
import { Individual } from "../../model/individual";
import { createCRUDLRoutes } from "../utils/create-crudl-routes";

export const individualRoutes = createCRUDLRoutes(e.Individual, Individual, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.Individual, request).run(c);
    },
    async update(id, request) {
        return e.update(e.Individual, (gc) => ({
            filter_single: {
                id
            },
            set: request
        })).run(c);
    }    
});
