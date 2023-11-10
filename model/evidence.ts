import { z } from "zod";
import { Base } from "./base";
import { DateTime, Email, GeoCoord, NeverEmptyText } from "./common";

export const Evidence = Base.merge(z.object({
    //
    contentHash: NeverEmptyText,
    contentType: NeverEmptyText,
    contentURL: NeverEmptyText,
    //
    title: NeverEmptyText,
    evidenceType: NeverEmptyText,
    //
    dateTime: DateTime,
    geoCoord: GeoCoord
}));