import { defineMiddleware } from 'astro:middleware';
import { isAppearanceFamilyId, isAppearanceMode } from './data/appearance-catalog';

// These six static Starlight specimens are mode-fixed at build time when they
// are embedded by the gallery's sandbox. The family and mode checks are
// deliberately closed; direct routes still pass through Starlight's normal
// theme provider and may apply the saved or system preference.
export const onRequest = defineMiddleware(async (context, next) => {
  const selected = /^\/appearance-preview\/([^/]+)\/([^/]+)\/$/.exec(context.url.pathname);
  const response = await next();
  const family = selected?.[1];
  const mode = selected?.[2];
  if (
    !selected ||
    response.status !== 200 ||
    !isAppearanceFamilyId(family) ||
    !isAppearanceMode(mode)
  ) return response;
  let html = await response.text();
  if (html.length > 1_000_000) throw new Error('Preview specimen exceeds its build bound');
  let roots = 0;
  html = html.replace(/<html\b[^>]*>/gi, tag => {
    roots += 1;
    if (!/\bdata-theme=["']dark["']/.test(tag)) throw new Error('Unexpected Starlight root mode');
    return tag.replace(/\bdata-theme=["']dark["']/, `data-theme="${mode}" data-appearance-preview="${family}"`);
  });
  if (roots !== 1 || (html.match(/<\/head>/gi) ?? []).length !== 1) throw new Error('Unexpected Starlight specimen document');
  html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="/appearance-preview/${family}.css"></head>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, headers });
});
