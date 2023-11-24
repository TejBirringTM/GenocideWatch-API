import { z } from "zod";
import { Email, URL } from "./common";

export const OnlinePresence = z.object({
    email: Email.nullish(),
    facebook: URL.nullish(),
    instagram: URL.nullish(),
    linkedIn: URL.nullish(),
    locals: URL.nullish(),
    patreon: URL.nullish(),
    rumble: URL.nullish(),
    twitter: URL.nullish(),
    website: URL.nullish(),
    telegram: URL.nullish(),
});
