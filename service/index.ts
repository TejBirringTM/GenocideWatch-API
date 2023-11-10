import { makeService } from "../server";
import configs from "../configs";
import { individualControllers } from "./controllers/individual";
import { evidenceControllers } from "./controllers/evidence";
import { createEntityRoutes } from "./utils/crudl-routes-factory";
import { e } from "../libs/edgedb";
import { Individual } from "../model/individual";

makeService({
    name: "Content Service",
    description: "",
    version: "v1.0",
    routes: [
        ...createEntityRoutes("individual", e.Individual, Individual, {
            create: true,
            read: true,
            list: true
        })
    ]
}, configs.service.port);
