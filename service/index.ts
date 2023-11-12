import { makeService } from "../server";
import configs from "../configs";
import { c, e } from "../libs/edgedb";
import { Individual } from "../model/individual";
import { Evidence } from "../model/evidence";
import { createCRUDLRoutes } from "./utils/create-crudl-routes";
import { GenocideContext } from "../model/genocide-context";
import { Organisation } from "../model/organisation";

const genocideContextRoutes = createCRUDLRoutes(e.GenocideContext, GenocideContext, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.GenocideContext, request).run(c);
    },
    async update(id, request) {
        return e.update(e.GenocideContext, (gc) => ({
            filter_single: {
                id
            },
            set: request
        })).run(c);
    }
});

const individualRoutes = createCRUDLRoutes(e.Individual, Individual, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.Individual, request).run(c);
    },
    async update(id, request) {
        return e.update(e.Individual, (gc) => ({
            filter_single: {
                id
            },
            set: request
        })).run(c);
    }    
});

const organisationRoutes = createCRUDLRoutes(e.Organisation, Organisation, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.Organisation, request).run(c);
    },
    async update(id, request) {
        return e.update(e.Organisation, (gc) => ({
            filter_single: {
                id
            },
            set: request
        })).run(c);
    }    
});

const evidenceRoutes = createCRUDLRoutes(e.Evidence, Evidence, {
    read: true,
    list: true,
    delete: true,
    async create(request) {
        return e.insert(e.Evidence, {
            // base
            notes: request.notes,
            tags: request.tags,
            // genocide context
            context: e.select(e.GenocideContext, (gc) => ({
                filter_single: {
                    id: request.context
                }
            })),
            // file info
            contentURL: request.contentURL,
            contentType: request.contentType,
            contentHash: request.contentHash,
            // evidence info
            title: request.title,
            evidenceType: request.evidenceType,
            // geospatial info
            dateTime: request.dateTime ? new Date(request.dateTime) : undefined,
            geoCoord: request.geoCoord ?? undefined,
            // contributors
            authors: request.authors && request.authors.length > 0 ? e.select(e.Individual, (ind) => ({
                filter: e.op(ind.id, "in", e.set(...((request.authors ?? []).map((indUUID) => e.uuid(indUUID)))))
            })) : e.set(),
            individualPublishers: request.individualPublishers && request.individualPublishers.length > 0  ? e.select(e.Individual, (ind) => ({
                filter: e.op(ind.id, "in", e.set(...((request.individualPublishers ?? []).map((indUUID) => e.uuid(indUUID)))))
            })) : e.set(),
            organisationalPublishers: request.organisationalPublishers && request.organisationalPublishers.length > 0 ? e.select(e.Organisation, (org) => ({
                filter: e.op(org.id, "in", e.set(...((request.organisationalPublishers ?? []).map((orgUUID) => e.uuid(orgUUID)))))
            })) : e.set()            
        }).run(c);
    },
    async update(id, request) {
        return e.update(e.Evidence, (ev) => ({
            filter_single: {
                id
            },
            set: {
                // base
                notes: request.notes,
                tags: request.tags,
                // genocide context
                context: request.context ? e.select(e.GenocideContext, (gc) => ({
                    filter_single: {
                        id: request.context ?? ""
                    }
                })) : undefined,
                // file info
                contentURL: request.contentURL,
                contentType: request.contentType,
                contentHash: request.contentHash,
                // evidence info
                title: request.title,
                evidenceType: request.evidenceType,
                // geospatial info
                dateTime: request.dateTime ? new Date(request.dateTime) : undefined,
                geoCoord: request.geoCoord ?? undefined,
                // contributors
                authors: request.authors && request.authors.length > 0 ? e.select(e.Individual, (ind) => ({
                    filter: e.op(ind.id, "in", e.set(...((request.authors ?? []).map((indUUID) => e.uuid(indUUID)))))
                })) : e.set(),
                individualPublishers: request.individualPublishers && request.individualPublishers.length > 0  ? e.select(e.Individual, (ind) => ({
                    filter: e.op(ind.id, "in", e.set(...((request.individualPublishers ?? []).map((indUUID) => e.uuid(indUUID)))))
                })) : e.set(),
                organisationalPublishers: request.organisationalPublishers && request.organisationalPublishers.length > 0 ? e.select(e.Organisation, (org) => ({
                    filter: e.op(org.id, "in", e.set(...((request.organisationalPublishers ?? []).map((orgUUID) => e.uuid(orgUUID)))))
                })) : e.set()                
            }            
        })).run(c);
    },
});


makeService({
    name: "Content Service",
    description: "",
    version: "v1.0",
    routes: [
        ...genocideContextRoutes,
        ...individualRoutes,
        ...organisationRoutes,
        ...evidenceRoutes
    ]
}, configs.service.port);
