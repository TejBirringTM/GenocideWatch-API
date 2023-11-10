import { z } from "zod";
import { Base } from "./base";
import { NeverEmptyText } from "./common";
import { OnlinePresence } from "./online-presence";

export const Organisation = Base.merge(OnlinePresence).merge(z.object({
    name: NeverEmptyText
}));