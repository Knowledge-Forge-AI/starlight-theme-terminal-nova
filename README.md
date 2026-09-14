# @knowledge-forge-ai/starlight-theme-terminal-nova

Independent Terminal Nova documentation theme; Forge Console 0.2.0 design

## Overview

Terminal Nova is an independent, first-party documentation theme built with Stellar Loom for [Astro Starlight](https://starlight.astro.build). Forge Console is the 0.2.0 design, featuring warm surfaces, disciplined monospace chrome, and an approved page-title-frame component override. Nova Observatory is retained as an editorial alternative in the project history.

Version 0.2.0 introduces the Theme v2 and catalog specification with orange primary and cyan alternate accents, responsive sidebar, catalog hero banner, and six canonical graphics. Version 0.1.0 released history is preserved.

[Repository](https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova) · [Issues](https://github.com/Knowledge-Forge-AI/starlight-theme-terminal-nova/issues) · [License](./LICENSE)

## Compatibility

- **Astro**: `^7.3.1`
- **Starlight**: `^0.42.0`
- **Node.js**: `>=22`

## Installation

Install the package from the npm registry:

```bash
npm install @knowledge-forge-ai/starlight-theme-terminal-nova
```

With installation scripts disabled:

```bash
npm install --ignore-scripts @knowledge-forge-ai/starlight-theme-terminal-nova
```

Or install from a local packed tarball:

```bash
npm install --ignore-scripts /path/to/knowledge-forge-ai-starlight-theme-terminal-nova-0.2.0.tgz
```

## Configuration

Add the theme plugin to your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import terminalNova from "@knowledge-forge-ai/starlight-theme-terminal-nova";

export default defineConfig({
  integrations: [
    starlight({
      title: "Documentation",
      plugins: [terminalNova()],
    }),
  ],
});
```

## Cascade Order & Custom CSS

The plugin automatically registers its theme stylesheets before consumer custom CSS:
The adapter declares Starlight before Loom layers. Unlayered compat CSS ensures correct sidebar-less width and coherent light print palettes. Consumer custom CSS loads after theme defaults:
- Dark/base theme tokens defined at `:root` or `:root, ::backdrop` are overridden by consumer `:root` rules.
- Light mode tokens emitted at `:root[data-theme='light']` are overridden by matching consumer rules.
- Component and utility class selectors in consumer custom CSS take precedence over theme defaults.

## Component Overrides

This package provides an opt-in `page-title-frame` component override wrapping Starlight's `PageTitle.astro`. If your Starlight configuration already specifies a `components.PageTitle` override, your override is preserved and takes precedence.

## Licensing & Permissions

First-party software is dual-licensed under the GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later) and commercial license terms. See `LICENSE`, `NOTICE`, and `COMMERCIAL-LICENSE.md`.

Official Nova Ingot marks and favicon artwork permissions remain separate from software licensing.

## Boundaries & Scope

No hosted npm provenance is claimed. System fonts do not promise pixel-identical rendering across operating systems. Package-local resources and font licenses are digest-bound; no runtime network requests are generated. Contrast ratios in the design specification are local design diagnostics.
