import { APIResponse, INTERNAL_SERVER_ERROR_RESPONSE, NOT_FOUND_RESPONSE, SUCCESS_RESPONSE } from "../../server";
import {$expr_PathNode, c, e} from "../../libs/edgedb"


export async function create<Root extends $expr_PathNode>(typeName: string, typeSchema: Root, data: any) : Promise<APIResponse<any>> {
    try {
        const response = await e.insert(typeSchema, data).run(c);
        console.info(`Database response:\n`, response);
        return SUCCESS_RESPONSE(`Created: ${typeName} (${response.id})`, response);
    } catch (e) {
        console.error(`Database error:\n`, e);
        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to create: ${typeName}`);
    }
}

export async function read<Root extends $expr_PathNode>(typeName: string, typeSchema: Root, id: string) : Promise<APIResponse<any>> {
    try {
        
        const response = await e.select(typeSchema, o => <any>({
            ...typeSchema["*"],
            filter_single: {
                id
            }
        })).run(c);
        console.info(`Database response:\n`, response);
        if (!response) {
            return NOT_FOUND_RESPONSE(`Not found: ${typeName} (${id})`);
        } else {
            return SUCCESS_RESPONSE(`Read: ${typeName} (${id})`, response);
        }
    } catch (e) {
        console.error(`Database error:\n`, e);
        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to read: ${typeName} (${id})`);
    }
}

export async function update<Root extends $expr_PathNode>(typeName: string, typeSchema: Root, id: string, data: any) : Promise<APIResponse<any>> {
    try {
        const response = await e.update(typeSchema, o => <any>({
            filter_single: {
                id
            },
            set: data
        })).run(c);
        console.info(`Database response:\n`, response);
        if (!response) {
            return NOT_FOUND_RESPONSE(`Not found: ${typeName} (${id})`);
        } else {
            return SUCCESS_RESPONSE(`Updated: ${typeName} (${id})`, response);
        }
    } catch (e) {
        console.error(`Database error:\n`, e);
        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to update: ${typeName} (${id})`);
    }
}

export async function remove<Root extends $expr_PathNode>(typeName: string, typeSchema: Root, id: string) : Promise<APIResponse<any>> {
    try {
        
        const response = await e.delete(typeSchema, o => <any>({
            filter_single: {
                id
            }
        })).run(c);
        console.info(`Database response:\n`, response);
        if (response) {
            return SUCCESS_RESPONSE(`Deleted: ${typeName} (${id})`, response);
        } else {
            return SUCCESS_RESPONSE(`Already deleted: ${typeName} (${id})`, {
                id
            });
        }
    } catch (e) {
        console.error(`Database error:\n`, e);
        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to delete: ${typeName} (${id})`);
    }
}

export async function list<Root extends $expr_PathNode>(typeName: string, typeSchema: Root) : Promise<APIResponse<any>> {
    try {
        const response = await e.select(typeSchema, o => <any>({
            ...typeSchema["*"]
        })).run(c);
        console.info(`Database response:\n`, response);
        return SUCCESS_RESPONSE(`Fetched: ${typeName}`, response);
    } catch (e) {
        console.error(`Database error:\n`, e);
        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to list: ${typeName}`);
    }
}




