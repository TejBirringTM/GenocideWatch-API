import { makeService } from "../server";
import configs from "../configs";
import { createIndividual } from "./controllers/individual";

makeService({
    name: "Content Service",
    description: "",
    version: "v1.0",
    routes: [
        {
            method: "POST",
            path: "individual",
            handler: createIndividual
        }
    ]
}, configs.service.port);
