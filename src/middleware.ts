import data from "../catalog-data.json" with { type: "json" };

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

export async function onRequest(context: MiddlewareContext, next: MiddlewareNext): Promise<Response> {
  const route = context.locals.starlightRoute;
  if (!route?.entry?.data || route.entry.data.hero) return next();
  if (typeof route.id !== "string") throw new Error("Missing public Starlight route ID");
  const normalize = (value: string) => "/" + value.replace(/^\/+|\/+$/g, "");
  const selected = (data as any).hero.routes.find((r: any) => normalize(r.route) === normalize(route.id!));
  if (selected) {
    route.entry.data.hero = { title: selected.title, tagline: selected.subtitle || selected.summary, actions: [] };
    context.locals.tfslCatalogHero = selected;
  }
  return next();
}
