import { z } from "zod";
import { ArrayOfMaybeEmptyText, ArrayOfNeverEmptyText, UUID } from "./common";

export const Base = z.object({
    id: UUID,
    notes: ArrayOfMaybeEmptyText,
    tags: ArrayOfNeverEmptyText
});