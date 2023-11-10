import { z } from "zod";
import { Base } from "./base";
import { GeoCoord, NeverEmptyText } from "./common";

export const GenocideContext = Base.merge(z.object({
    slug: NeverEmptyText,
    name: NeverEmptyText,
    mapDefaultGeoCoord: GeoCoord,
    mapDefaultZoom: z.number().int()
}))