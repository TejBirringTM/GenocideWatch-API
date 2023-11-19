import { Response } from "express"
import { HttpResponseStatusCode, httpResponseStatus } from "./http";

export type APIResponse<T> = {
    status: HttpResponseStatusCode,
    userFriendlyMessage: string,
    data: T
}

export function makeResponder<T>(expressResponse: Response) {
    return {
        respond(responseObj: APIResponse<T>) {
            expressResponse.status(responseObj.status).send(responseObj);
            return;
        }
    } as const;
}

export type Responder<T> = ReturnType<typeof makeResponder<T>>;

export const BAD_REQUEST_RESPONSE = (msg: string) => ({
    status: httpResponseStatus.BAD_REQUEST,
    userFriendlyMessage: msg,
    data: undefined
}) as const;

export const INTERNAL_SERVER_ERROR_RESPONSE = (msg: string) => ({
    status: httpResponseStatus.INTERNAL_SERVER_ERROR,
    userFriendlyMessage: msg,
    data: undefined
}) as const;

export const NOT_FOUND_RESPONSE = (msg: string) => ({
    status: httpResponseStatus.NOT_FOUND,
    userFriendlyMessage: msg,
    data: undefined
}) as const;

export const NOT_IMPLEMENTED_RESPONSE = (msg: string) => ({
    status: httpResponseStatus.NOT_IMPLEMENTED,
    userFriendlyMessage: msg,
    data: undefined
}) as const;

export const SUCCESS_RESPONSE = <T>(msg: string, data: T) => ({
    status: httpResponseStatus.OK,
    userFriendlyMessage: msg,
    data: data
}) as const;

export const UNAUTHORISED_RESPONSE = (msg: string) => ({
    status: httpResponseStatus.UNAUTHORISED,
    userFriendlyMessage: msg,
    data: undefined
}) as const;
