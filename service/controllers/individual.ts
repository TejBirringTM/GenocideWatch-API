import { e } from "../../libs/edgedb";
import { Individual } from "../../model/individual";
import { createEntityControllers } from "../utils/crudl-controllers-factory";

export const individualControllers = createEntityControllers("Individual", e.Individual, Individual,{
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true
});
