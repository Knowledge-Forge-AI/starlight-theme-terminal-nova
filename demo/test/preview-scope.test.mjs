import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = process.env.PREVIEW_SCOPE_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const middleware = readFileSync(path.join(root, 'src/middleware.ts'), 'utf8');
const css = readFileSync(path.join(root, 'src/styles/project-site.css'), 'utf8');
const families = ['terminal-nova', 'nebular', 'developer', 'graphic-designer', 'anime', 'gamer'];
// Exercise the authored middleware body without loading the Astro build host.
// Route validation is supplied here; the response transform remains real source.
const onRequest = new Function('defineMiddleware', 'isAppearanceFamilyId', 'isAppearanceMode',
  middleware.replace(/^import .*;\r?\n/gm, '').replace('export const onRequest', 'const onRequest') + '\nreturn onRequest;')(
    callback => callback, value => families.includes(value), value => ['light', 'dark'].includes(value));
const document = '<!doctype html><html lang="en" data-theme="dark"><head></head><body>specimen</body></html>';

test('each closed family/mode specimen carries its own site-palette exclusion', async () => {
  for (const family of families) for (const mode of ['light', 'dark']) {
    const response = await onRequest({ url: new URL(`https://example.test/appearance-preview/${family}/${mode}/`) },
      async () => new Response(document, { headers: { 'content-type': 'text/html', 'content-length': '1' } }));
    const result = await response.text();
    assert.ok(result.includes(`data-theme="${mode}" data-appearance-preview="${family}"`));
    assert.ok(result.includes(`href="/appearance-preview/${family}.css"`));
    assert.equal(response.headers.has('content-length'), false);
  }
});

test('ordinary and unrecognized pages are not marked as family specimens', async () => {
  for (const pathname of ['/', '/docs/appearance-families/', '/appearance-preview/unknown/light/', '/appearance-preview/anime/auto/']) {
    const response = await onRequest({ url: new URL(`https://example.test${pathname}`) }, async () => new Response(document));
    assert.equal(await response.text(), document);
  }
});

test('Pages-only palette and font selectors exclude specimen roots', () => {
  assert.match(css, /html:root:not\(\[data-appearance-preview\]\)\s*\{/);
  assert.match(css, /html:root:not\(\[data-appearance-preview\]\)\[data-theme='light'\]\s*\{/);
  assert.doesNotMatch(css, /html:root(?:\[data-theme='light'\])?\s*\{/);
});

test('unexpected root mode is refused instead of creating a partial specimen', async () => {
  await assert.rejects(() => onRequest({ url: new URL('https://example.test/appearance-preview/anime/light/') },
    async () => new Response(document.replace('data-theme="dark"', 'data-theme="auto"'))), /Unexpected Starlight root mode/);
});
