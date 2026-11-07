# Distributed brand asset inventory

The four identity files below are byte-identical to the corresponding legacy
outputs in the source collection's docs/ tree. Existing identity artwork is
not added or modified by this documentation change.

Public consumer baseline: STTN commit a5aa4cc5079f8392efba79269bc24365d5e040c2.
Legacy collection: commit 461d9add96ed6c04b341e31305697a9046eed1a8.
Brand policy blob: f0b2a2a3c7da8f80fff75c6c9c174332706b6fd6
(SHA-256 966282712d1107318de7d51edd20bfbd282c4afeb8505341d7480c33a72e39e6).

Source collection attribution: Copyright (c) 2026 Samuel Leighton Lair and
Knowledge Forge AI contributors. Brand-use guidance is explained in [README-BRAND.md](README-BRAND.md).

| File | Role and intended surface | SHA-256 |
| --- | --- | --- |
| favicon-on-dark.svg | Dedicated favicon; dark surface | 3bcf7b8be08f2b29dd018187dda8f4d76cd3ea294995aab1e028e50e2f1c2eda |
| favicon-on-light.svg | Dedicated favicon; light surface | cbcf044cd7b3024f9419c0cbe9396d1e9cc0d0d777d64a17581d1ea89debc51e |
| theme-forge-terminal-nova-mark-on-dark.svg | Standalone Nova Ingot mark; dark surface | 138751558fef0cffae9ca3e3556a33544fa58526599bfae34e3515beb6aad154 |
| theme-forge-terminal-nova-mark-on-light.svg | Standalone Nova Ingot mark; light surface | ea6b2d70dfa117fc7e875c746c98c512066825af1a3b4980b33409dfc687ebf0 |

## Site-owned social metadata

The current Open Graph and Twitter delivery is an independent text-only
asset, separate from the four protected Nova Ingot treatments above:

| File | Role and intended surface | SHA-256 |
| --- | --- | --- |
| `sttn-social.svg` | Editable 1200×630 STTN social metadata source, 1,710 bytes | `805fa4ed8135e2084b745582f910d20b0e30e92bb9525e50788804c0e51c8296` |
| `sttn-social.png` | Current deterministic 1200×630 PNG Open Graph/Twitter delivery, 40,677 bytes | `5ad5e27793c0867ad883ffdd4f10845702c0b34ebe9d5b61dc3bf9f268271fd4` |

The PNG is a mechanical raster of the authored text-only SVG using the locally
admitted Sharp 0.35.5 renderer. The renderer's Apache-2.0 terms are software
terms only and do not add an artwork or identity license.

## Historical social-card projection

The existing `../art/nova-social.svg` remains byte-for-byte unchanged as a
historical promotional example. It is not the current metadata source because
its authored card identifies Terminal Nova 0.2. Its prior `nova-social.png`
projection (104,408 bytes, SHA-256
`9193bb7f1944178f9a21068591c9e63c87d1c233a19cbc0bbad4bb2f37feeb1f`) was an
unused projection and was removed after its receipt was retained in the
superseded export manifest.

## Source trace

- [favicon-on-dark.svg](https://github.com/Knowledge-Forge-AI/theme-forge-terminal-nova/blob/461d9add96ed6c04b341e31305697a9046eed1a8/docs/public/favicon-on-dark.svg): Git blob 78dbdea30e474040ce4afaf77b58985059699cb8.
- [favicon-on-light.svg](https://github.com/Knowledge-Forge-AI/theme-forge-terminal-nova/blob/461d9add96ed6c04b341e31305697a9046eed1a8/docs/public/favicon-on-light.svg): Git blob cb749a9ab045d3f23e589eba31ddc59e2ca12cd3.
- [theme-forge-terminal-nova-mark-on-dark.svg](https://github.com/Knowledge-Forge-AI/theme-forge-terminal-nova/blob/461d9add96ed6c04b341e31305697a9046eed1a8/docs/src/assets/brand/theme-forge-terminal-nova-mark-on-dark.svg): Git blob 620a8d3bb4a43c0414feee886d7a743998fc7ffb.
- [theme-forge-terminal-nova-mark-on-light.svg](https://github.com/Knowledge-Forge-AI/theme-forge-terminal-nova/blob/461d9add96ed6c04b341e31305697a9046eed1a8/docs/src/assets/brand/theme-forge-terminal-nova-mark-on-light.svg): Git blob 184978caed40392052ef6900b8b3c88801be5def.

This inventory records provenance and approved treatments. It changes no
license terms: these files, like the software, reusable theme resources and
demonstration content, remain under the terms stated in NOTICE and LICENSE;
third-party material retains its own terms.
