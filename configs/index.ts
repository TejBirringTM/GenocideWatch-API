import { loadRequiredEnvironmentVariable } from "./env";

export default {
    service: {
        port: loadRequiredEnvironmentVariable("PORT", "int"),
    },
    firebase: {
        privateKey: JSON.parse(loadRequiredEnvironmentVariable("FIREBASE_ADMIN_PRV_KEY_JSON", "string"))
    },
    clientKeys: [
        loadRequiredEnvironmentVariable("CLIENT_KEY_FIREBASE_FUNCTIONS", "string"),
        loadRequiredEnvironmentVariable("CLIENT_KEY_WEB_APP", "string"),
    ]
} as const;
