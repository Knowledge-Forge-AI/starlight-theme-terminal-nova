#!/usr/bin/env node
// Explicit installed compiler, canonical input and fresh output directory.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile, lstat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const root = fileURLToPath(new URL('../', import.meta.url));
const [installedRoot, inputPath, outputPath, tarballPath] = process.argv.slice(2);
if (!installedRoot || !inputPath || !outputPath || !tarballPath) {
  throw new Error('Usage: generate-theme.mjs <installed-loom-root> <theme.json> <fresh-output> <loom.tgz>');
}
const pkgRoot = resolve(installedRoot);
assert.equal((await lstat(pkgRoot)).isSymbolicLink(), false);
const pkg = JSON.parse(await readFile(join(pkgRoot, 'package.json'), 'utf8'));
assert.equal(pkg.name, '@knowledge-forge-ai/theme-forge-stellar-loom');
assert.equal(pkg.version, '0.2.0', 'Installed Loom RC compiler must be 0.2.0');

const api = await import(pathToFileURL(join(pkgRoot, pkg.exports['.'].import)).href);
const themeBytes = await readFile(inputPath);
const theme = JSON.parse(themeBytes);
const metadata = JSON.parse(await readFile(join(root, 'package-metadata.json'), 'utf8'));
const loomTarballSha256 = digest(await readFile(tarballPath));
await mkdir(outputPath); // Refuse every pre-existing destination.

const encoder = new TextEncoder();
function compareUtf8(a, b) {
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  const minLen = Math.min(bufA.length, bufB.length);
  for (let i = 0; i < minLen; i++) {
    if (bufA[i] !== bufB[i]) return bufA[i] - bufB[i];
  }
  return bufA.length - bufB.length;
}

const PUBLIC_README = `# ${metadata.name}

${metadata.description}

## Overview

Terminal Nova is an independent, first-party documentation theme built with Stellar Loom for [Astro Starlight](https://starlight.astro.build). Forge Console is the 0.2.0 design, featuring warm surfaces, disciplined monospace chrome, and an approved page-title-frame component override. Nova Observatory is retained as an editorial alternative in the project history.

Version 0.2.0 introduces the Theme v2 and catalog specification with orange primary and cyan alternate accents, responsive sidebar, catalog hero banner, and six canonical graphics. Version 0.1.0 released history is preserved.

[Repository](https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova) · [Issues](https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova/issues) · [License](./LICENSE)

## Compatibility

- **Astro**: \`^7.3.1\`
- **Starlight**: \`^0.42.0\`
- **Node.js**: \`>=22\`

## Installation

Install the package from the npm registry:

\`\`\`bash
npm install ${metadata.name}
\`\`\`

With installation scripts disabled:

\`\`\`bash
npm install --ignore-scripts ${metadata.name}
\`\`\`

Or install from a local packed tarball:

\`\`\`bash
npm install --ignore-scripts /path/to/knowledge-forge-ai-starlight-theme-terminal-nova-0.2.0.tgz
\`\`\`

## Configuration

Add the theme plugin to your \`astro.config.mjs\`:

\`\`\`javascript
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import terminalNova from "${metadata.name}";

export default defineConfig({
  integrations: [
    starlight({
      title: "Documentation",
      plugins: [terminalNova()],
    }),
  ],
});
\`\`\`

## Cascade Order & Custom CSS

The plugin automatically registers its theme stylesheets before consumer custom CSS:
The adapter declares Starlight before Loom layers. Unlayered compat CSS ensures correct sidebar-less width and coherent light print palettes. Consumer custom CSS loads after theme defaults:
- Dark/base theme tokens defined at \`:root\` or \`:root, ::backdrop\` are overridden by consumer \`:root\` rules.
- Light mode tokens emitted at \`:root[data-theme='light']\` are overridden by matching consumer rules.
- Component and utility class selectors in consumer custom CSS take precedence over theme defaults.

## Component Overrides

This package provides an opt-in \`page-title-frame\` component override wrapping Starlight's \`PageTitle.astro\`. If your Starlight configuration already specifies a \`components.PageTitle\` override, your override is preserved and takes precedence.

## Licensing & Permissions

First-party software is dual-licensed under the GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later) and commercial license terms. See \`LICENSE\`, \`NOTICE\`, and \`COMMERCIAL-LICENSE.md\`.

Official Nova Ingot marks and favicon artwork permissions remain separate from software licensing.

## Boundaries & Scope

No hosted npm provenance is claimed. System fonts do not promise pixel-identical rendering across operating systems. Package-local resources and font licenses are digest-bound; no runtime network requests are generated. Contrast ratios in the design specification are local design diagnostics.
`;

const PUBLIC_CHANGELOG = `# Changelog

All notable changes to \`${metadata.name}\` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-10

Minor release advancing Terminal Nova to Theme v2 and catalog component architecture with dual accent support and original vector graphics.

### Added

- **Theme v2 Architecture**: Full Theme v2 palette token sets for light and dark modes with strict role separation.
- **Dual Accent Selection**: Orange primary accent and cyan alternate accent variants selectable at generation time.
- **Catalog Components**: Catalog Hero banner route on \`/overview\`, nested Sidebar, card-variant Pagination, and framed PageTitle.
- **Six Canonical Graphics**: Integrated technical SVG scenes (\`console-hero.svg\`, \`orbital-section.svg\`, \`workbench-layout.svg\`, \`palette-matrix.svg\`, \`component-anatomy.svg\`, \`data-flow-path.svg\`).
- **Offline Isolation**: Zero external network requests at runtime; digest-bound assets.
- **Expressive Code Integration**: Syntax themes for light and dark modes with frame, marks, and copy controls under consumer precedence.

### Changed

- Promoted package target to 0.2.0 public release metadata.
- Preserved consumer component override precedence and cascade order.

## [0.1.0] - 2026-09-10

Initial published release on npm registry and GitHub Releases.

### Added

- **Forge Console Design**: Initial v0.1.x design featuring warm surfaces, system-sans typography, and page-title-frame component override.
- **Starlight Compatibility**: Validated against Astro 7.3.1 and Starlight 0.42.0.
- **Dual Licensing**: AGPL-3.0-or-later and commercial license options.
`;

function finalizePublicPackage(result, compilerPkg) {
  const commercial = result.files.get('COMMERCIAL-LICENSE.md');
  assert.equal(typeof commercial, 'string');
  result.files.set('COMMERCIAL-LICENSE.md', commercial.replace('Theme Forge Stellar Burst releases', 'Starlight Theme Terminal Nova releases'));
  const notice = result.files.get('NOTICE');
  assert.equal(typeof notice, 'string');
  result.files.set('NOTICE', '# Starlight Theme Terminal Nova Notice\n\nGenerated with Theme Forge Stellar Loom. The original generator notice follows.\n\n' + notice);
  // 1. Update README.md to public-ready documentation
  result.files.set('README.md', PUBLIC_README);

  // 2. Add CHANGELOG.md preserving 0.1.0 released history
  result.files.set('CHANGELOG.md', PUBLIC_CHANGELOG);

  // 3. Update package.json to public-ready metadata
  const rawPkg = JSON.parse(result.files.get('package.json'));
  rawPkg.name = metadata.name;
  rawPkg.version = metadata.version;
  rawPkg.description = metadata.description;
  rawPkg.license = metadata.license || 'AGPL-3.0-or-later';
  if (metadata.author) rawPkg.author = metadata.author;
  rawPkg.private = false;
  rawPkg.publishConfig = {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  };
  rawPkg.repository = {
    type: 'git',
    url: 'git+https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova.git',
  };
  rawPkg.homepage = 'https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova#readme';
  rawPkg.bugs = {
    url: 'https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova/issues',
  };
  rawPkg.engines = {
    node: '>=22',
  };
  rawPkg.peerDependencies = {
    '@astrojs/starlight': '^0.42.0',
    astro: '^7.3.1',
  };

  const hasMiddleware = result.files.has('middleware.js');
  rawPkg.exports = {
    '.': { types: './index.d.ts', import: './index.js' },
    './catalog-data.json': './catalog-data.json',
    './navigation.js': './navigation.js',
    './styles/*': './styles/*',
    './components/*': './components/*',
    './assets/*': './assets/*',
    './licenses/*': './licenses/*',
    ...(hasMiddleware ? { './middleware.js': './middleware.js', './middleware': './middleware.js' } : {}),
  };

  const fileList = [
    'index.js',
    'catalog-data.json',
    'navigation.js',
    'index.d.ts',
    'styles',
    'fonts',
    'components',
    'assets',
    'licenses',
    'theme.json',
    'theme.descriptor.json',
    'provenance.json',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'NOTICE',
    'COMMERCIAL-LICENSE.md',
    ...(hasMiddleware ? ['middleware.js'] : []),
  ];
  rawPkg.files = fileList.filter(f => result.files.has(f) || ['styles', 'fonts', 'components', 'assets', 'licenses'].includes(f));
  delete rawPkg.scripts;

  result.files.set('package.json', JSON.stringify(rawPkg, null, 2) + '\n');

  // 4. Rebuild complete provenance.json
  result.files.delete('provenance.json');
  const records = [...result.files]
    .sort(([a], [b]) => compareUtf8(a, b))
    .map(([path, content]) => ({
      path,
      size: typeof content === 'string' ? Buffer.byteLength(content, 'utf8') : content.byteLength,
      sha256: digest(content),
    }));

  const provenance = {
    schema: 'tfsl.package-provenance-v2',
    producer: {
      package: compilerPkg.name,
      version: compilerPkg.version,
    },
    descriptor: result.descriptor,
    packageName: metadata.name,
    packageVersion: metadata.version,
    inventoryDigest: digest('tfsl.package-inventory-v2\n' + JSON.stringify(records)),
    inventoryExcludes: ['provenance.json'],
    files: records,
    fonts: result.themeSpec?.fonts ?? [],
    fontLicenses: result.themeSpec?.catalog?.fontLicenses ?? [],
  };
  result.files.set('provenance.json', JSON.stringify(provenance, null, 2) + '\n');
  result.provenance = provenance;
}

const receipt = {
  schema: 'tfsb65.theme-generation-v1',
  inputFileSha256: digest(themeBytes),
  loomTarballSha256,
  compiler: {
    name: pkg.name,
    version: pkg.version,
  },
  themeTargetVersion: metadata.version,
  accents: {},
};

for (const accent of ['orange', 'cyan']) {
  const options = { themeSpec: theme, metadata, accent };
  const first = api.generateThemePackageCatalog(options);
  const second = api.generateThemePackageCatalog(options);

  // Recompile fresh exchange-v2 candidate
  const candidate = api.createThemeCatalogCandidate(theme, { metadata, accent, tarballDigest: `sha256:${loomTarballSha256}` });
  const verification = api.verifyThemeCatalogCandidate(candidate);
  assert.equal(verification.valid, true, JSON.stringify(verification.errors));

  // Finalize public-ready package from source
  finalizePublicPackage(first, pkg);
  finalizePublicPackage(second, pkg);

  const inventory = result => [...result.files].map(([path, bytes]) => ({ path, sha256: digest(bytes) })).sort((a,b) => a.path.localeCompare(b.path, 'en'));
  assert.deepEqual(inventory(first), inventory(second));

  await api.writeThemePackage(first, join(outputPath, accent));
  await api.writeThemePackage(second, join(outputPath, `${accent}-repeat`));
  await writeFile(join(outputPath, `${accent}.candidate.json`), api.serializeThemeCatalogCandidate(candidate), { flag: 'wx' });
  receipt.accents[accent] = { descriptor: first.descriptor, candidateDigest: candidate.candidateDigest, verification, inventory: inventory(first), deterministic: true };
}

await writeFile(join(outputPath, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', inputFileSha256: receipt.inputFileSha256, accents: Object.keys(receipt.accents) }));
