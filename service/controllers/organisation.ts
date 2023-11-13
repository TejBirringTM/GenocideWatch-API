import { c, e } from "../../libs/edgedb";
import { Organisation } from "../../model/organisation";
import { createCRUDLRoutes } from "../utils/create-crudl-routes";

export const organisationRoutes = createCRUDLRoutes(e.Organisation, Organisation, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.Organisation, request).run(c);
    },
    async update(id, request) {
        return e.update(e.Organisation, (gc) => ({
            filter_single: {
                id
            },
            set: request
        })).run(c);
    }    
});
