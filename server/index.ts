import {Server as HttpServer} from "http";
import express, { NextFunction } from "express"
import { AnyRoute, Route } from "./route";
import { BAD_REQUEST_RESPONSE, makeResponder } from "./response";
import cors from "cors";
type ExpressRequest = express.Request;
type ExpressResponse = express.Response;


class Server {
    readonly name
    readonly description
    readonly version
    readonly routes
    readonly #server
    #serverInstance: HttpServer | undefined

    private constructor(
        name: string,
        description: string,
        version: string,
        routes: AnyRoute[]
    ) {
        console.info(`Creating service: ${name}`);
        this.name = name;
        this.description = description;
        this.version = version;
        this.routes = routes;
        // create server app
        this.#server = express();
        // use cors middleware
        this.#server.use(cors());
        // use json middleware
        this.#server.use(express.json());
        // handle errors at the top-level
        this.#server.use((error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
            const responder = makeResponder(response);
            if (error instanceof SyntaxError) {
                responder.respond(BAD_REQUEST_RESPONSE("Request is not a valid JSON."));
            } else {
                next();
            }
        });
        // listen to exit sigs
        process.on("SIGINT", ()=>this.stop("SIGINT received."));
        process.on("SIGTERM", ()=>this.stop("SIGTERM received."));
        // install
        this.#installRoutes();
        console.info(`Created service: ${name}`);
    }

    stop(why: string) {
        if (!this.#serverInstance) return;
        this.#serverInstance.close();
        console.info(`\nService '${this.name}' stopped: ${why}`);
    }

    start(port: number) {
        this.#serverInstance = this.#server.listen(port, ()=>{
            console.info(`Service '${this.name}' started on port: ${port}`);
        });
    }

    static async make(
        name: string,
        description: string,
        version: string,
        routes: AnyRoute[]
    ) {
        return new Server(name, description, version, routes);
    }

    #installRoutes() {
        if (!this.#server) return;
        this.routes.forEach((route)=>{
            const handler = (req: ExpressRequest, res: ExpressResponse)=>route.handler.handle.call(route.handler, req, res);
            const method = route.method;
            const path = `/${this.version}/${route.path}`;
            switch (method) {
                case 'POST': 
                    this.#server.post(path, handler);
                    break;
                case 'GET': 
                    this.#server.get(path, handler);
                    break;
                case 'PUT': 
                    this.#server.put(path, handler);
                    break;
                case 'PATCH': 
                    this.#server.patch(path, handler);
                    break;
                case 'DELETE': 
                    this.#server.delete(path, handler);
                    break;
            }
            console.info(`Installed controller: ${method} ${path}`);
        });
    }    
}


export async function makeService(args: {
    name: string,
    description: string,
    version: string,
    routes: AnyRoute[]
}, port: number) {
    const server = await Server.make(args.name, args.description, args.version, args.routes);
    server.start(port);
}


export { makeRouteHandler } from "./route-handler";
export { INTERNAL_SERVER_ERROR_RESPONSE, BAD_REQUEST_RESPONSE, NOT_FOUND_RESPONSE, SUCCESS_RESPONSE, NOT_IMPLEMENTED_RESPONSE } from "./response";
export { APIResponse } from "./response";
