# Changelog

All notable changes to `@knowledge-forge-ai/starlight-theme-terminal-nova` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-10

Minor release advancing Terminal Nova to Theme v2 and catalog component architecture with dual accent support and original vector graphics.

### Added

- **Theme v2 Architecture**: Full Theme v2 palette token sets for light and dark modes with strict role separation.
- **Dual Accent Selection**: Orange primary accent and cyan alternate accent variants selectable at generation time.
- **Catalog Components**: Catalog Hero banner route on `/overview`, nested Sidebar, card-variant Pagination, and framed PageTitle.
- **Six Canonical Graphics**: Integrated technical SVG scenes (`console-hero.svg`, `orbital-section.svg`, `workbench-layout.svg`, `palette-matrix.svg`, `component-anatomy.svg`, `data-flow-path.svg`).
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
