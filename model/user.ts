import { z } from "zod";
import {Individual} from "./individual";
import { Email, NeverEmptyText } from "./common";

export const UserRole = z.union([
    z.literal("Administrator"),
    z.literal("Editor"),
    z.literal("Contributor"),
    z.literal("User")
]);
export type UserRole = z.infer<typeof UserRole>;

export const User = Individual.merge(z.object({
    email: Email,
    role: UserRole
}));
export type User = z.infer<typeof User>;
