import { c, e } from "../../libs/edgedb";
import { Organisation } from "../../model/organisation";
import { createCRUDLRoutes } from "../utils/create-crudl-routes";

export const organisationRoutes = createCRUDLRoutes(e.Organisation, Organisation, {
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
