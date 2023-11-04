import { loadRequiredEnvironmentVariable } from "./env";

export default {
    service: {
        port: loadRequiredEnvironmentVariable("PORT", "int"),
    }
} as const;
