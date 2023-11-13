import { makeService } from "../server";
import configs from "../configs";
import { c, e } from "../libs/edgedb";
import { genocideContextRoutes } from "./controllers/genocide-context";
import { individualRoutes } from "./controllers/individual";
import { organisationRoutes } from "./controllers/organisation";
import { evidenceRoutes } from "./controllers/evidence";

makeService({
    name: "Content Service",
    description: "",
    version: "v1.0",
    routes: [
        ...genocideContextRoutes,
        ...individualRoutes,
        ...organisationRoutes,
        ...evidenceRoutes
    ]
}, configs.service.port);
