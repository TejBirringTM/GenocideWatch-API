import { c, e } from "../../libs/edgedb";
import { Individual } from "../../model/individual";
import { createCRUDLRoutes } from "../utils/create-crudl-routes";

export const individualRoutes = createCRUDLRoutes(e.Individual, Individual, {
    read: {
        access: "Public"
    },
    list: {
        access: "Public"
    },
    delete: {
        access: "Editor"
    },
    create: {
        access: "Contributor",
        transform(request) {
            return request;
        }
    },
    update: {
        access: "Contributor",
        transform(request) {
            return request;
        }
    }    
});
