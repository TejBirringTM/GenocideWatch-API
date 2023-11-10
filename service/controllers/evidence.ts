import { z } from "zod";
import { createEntityControllers } from "../utils/crudl-controllers-factory";
import { e } from "../../libs/edgedb";
import { Evidence } from "../../model/evidence";

export const evidenceControllers = createEntityControllers("Evidence", e.Evidence, Evidence, {
    create: true,
    read: true,
    update: true,
    delete: true,
    list: true
});
