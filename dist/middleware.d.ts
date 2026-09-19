export interface MiddlewareContext {
    locals: {
        starlightRoute?: {
            id?: string;
            entry?: {
                data?: {
                    hero?: unknown;
                };
            };
        };
        tfslCatalogHero?: unknown;
    };
}
export type MiddlewareNext = () => Promise<Response> | Response;
export declare function onRequest(context: MiddlewareContext, next: MiddlewareNext): Promise<Response>;
//# sourceMappingURL=middleware.d.ts.map