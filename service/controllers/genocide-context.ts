import { c, e } from "../../libs/edgedb";
import { GenocideContext } from "../../model/genocide-context";
import { createCRUDLRoutes } from "../utils/create-crudl-routes";

export const genocideContextRoutes = createCRUDLRoutes(e.GenocideContext, GenocideContext, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.GenocideContext, request).run(c);
    },
    async update(id, request) {
        return e.update(e.GenocideContext, (gc) => ({
            filter_single: {
                id
            },
            set: request
        })).run(c);
    }
});
