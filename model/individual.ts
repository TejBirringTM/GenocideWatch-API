import { z } from "zod";
import { ArrayOfMaybeEmptyText, ArrayOfNeverEmptyText, MaybeEmptyText, NeverEmptyText, UUID } from "./common";
import { Base } from "./base";
import { OnlinePresence } from "./online-presence";

export const Individual = Base.merge(OnlinePresence).merge(z.object({
    name: NeverEmptyText,
}));

export type Individual = z.infer<typeof Individual>;