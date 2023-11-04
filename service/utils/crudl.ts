import { APIResponse, INTERNAL_SERVER_ERROR_RESPONSE, SUCCESS_RESPONSE } from "../../server";
import {$expr_PathNode, c, e} from "../../libs/edgedb"

export async function create<Root extends $expr_PathNode>(typeName: string, typeSchema: Root, data: any) : Promise<APIResponse<any>> {
    try {
        const response = await e.insert(typeSchema, data).run(c);
        return SUCCESS_RESPONSE(`Created: ${typeName}`, {
            id: response.id
        });
    } catch (e) {
        console.error(e);
        return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to create: ${typeName}`);
    }
}

// export async function select<Root extends $expr_PathNode>(typeName: string, typeSchema: Root, data: any) : Promise<APIResponse<any>> {
//     try {
//         const response = await e.insert(typeSchema, data).run(c);
//         return SUCCESS_RESPONSE(`Read: ${typeName}`, {
//             id: response.id
//         });
//     } catch (e) {
//         console.error(e);
//         return INTERNAL_SERVER_ERROR_RESPONSE(`Failed to read: ${typeName}`);
//     }
// }

