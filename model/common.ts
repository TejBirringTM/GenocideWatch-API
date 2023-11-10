import { z } from "zod";

export const UUID = z.string().uuid();
export const Email = z.string().email();
export const URL = z.string().url();

export const DateTime = z.string().datetime();

export const NeverEmptyText = z.string().min(1);
export const MaybeEmptyText = z.string();
export const ArrayOfMaybeEmptyText = MaybeEmptyText.array();
export const ArrayOfNeverEmptyText = NeverEmptyText.array();

export const GeoCoord = z.object({
    lat: z.number(),
    lng: z.number()
});