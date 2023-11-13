import { c, e } from "../../libs/edgedb";
import { GenocideContext } from "../../model/genocide-context";
import { createCRUDLRoutes } from "../utils/create-crudl-routes";

export const genocideContextRoutes = createCRUDLRoutes(e.GenocideContext, GenocideContext, {
    read: {
        access: "Public"
    },
    list: {
        access: "Public"
    },
    delete: {
        access: "Editor/Reviewer"
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
