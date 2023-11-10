import { z } from "zod";
import { ArrayOfNeverEmptyText, MaybeEmptyText, UUID } from "./common";

export const Base = z.object({
    id: UUID,
    notes: MaybeEmptyText.nullish(),
    tags: ArrayOfNeverEmptyText.nullish()
});