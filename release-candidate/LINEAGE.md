# Terminal Nova Release Candidate Lineage

## Overview

This directory defines the **0.1.0 release candidate** for `starlight-theme-terminal-nova`, maintaining complete visual, structural, and semantic lineage from the TFSB54 evaluation (`docs/evaluations/tfsb54-terminal-nova.md`, base commit `3f60fe1a13d71b04f79bf57f7beb94b7cc3edbe4`).

## Design Lineage

1. **Selected Design (Forge Console)**:
   - Canonical spec: `terminal-nova.theme.json` / `forge-console.theme.json`
   - Canonical metadata: `package-metadata.json` / `forge-console.package.json`
   - Role: Provisional technical-documentation preference
   - Version progression: `0.1.0-preview.1` -> `0.1.0`
   - Tokens: Exact byte-for-byte palette, typography (`system-sans`, 18px, 1.65 line-height), layout (44rem content, 17rem sidebar), and template (`page-title-frame`).
   - TFSB54 reference identities:
     - Theme SHA-256: `14bf66776767ec02c6552736ef8201222d70f1749b380bda4545486c13e58db7`
     - CSS SHA-256: `c913f7efceb32da8f7562c6eff9e269c9e9b88070686735e905e68a77804ff37`
     - Package SHA-256: `55d842bd44605e20f67cbbd008997f826bc9278b4391d0dedbe1cdc78aea5650`

2. **Retained Alternative (Nova Observatory)**:
   - Alternative spec: `nova-observatory.theme.json`
   - Alternative metadata: `nova-observatory.package.json`
   - Role: Retained editorial alternative
   - Version progression: `0.1.0-preview.1` -> `0.1.0`
   - Tokens: Exact byte-for-byte palette (violet tones), typography (`system-serif`, 19px, 1.8 line-height), layout (48rem content, 19rem sidebar), default template.
   - TFSB54 reference identities:
     - Theme SHA-256: `d0e43dbbe243595a54d88397a899e5ef2aa8aca88650a5cf3462c5305dad5868`
     - CSS SHA-256: `8d85574f882e9f2443665163a0e5b34ae596e7747527fe6b17d9c8a3407e4226`
     - Package SHA-256: `1e82cc238c12cb661f997532ac138d80e6396e7c7382b7435eb4976c3b7c5285`

## Preserved Historical Evidence

- Historical selected spec: `themes/terminal-nova/terminal-nova.theme.json`
- Historical package metadata: `themes/terminal-nova/package-metadata.json`
- Candidate specifications: `themes/terminal-nova/candidates/`
- Real exchange packets: `themes/terminal-nova/exchange/`
- Installed render evidence & screenshots: `themes/terminal-nova/evidence/`
- Render evidence handoff: the separately supplied five-image comparison and digest manifest

## Invariants

- **Zero CSS / plugin mutation**: Compilation and generation maintain pure deterministic output matching TFSB54.
- **No legacy code**: Completely independent first-party implementation; no legacy CSS, JavaScript, Astro, tokens, or layout from legacy fork (`madLinux7/starlight-theme-terminal` or private forks).
- **No dependency changes**: Consumer lock remains Astro 7.3.1 and Starlight 0.42.0.
- **No aesthetic approval claim**: Provisional selection is evidence-based; no aesthetic endorsement claimed.
- **No registry existence claim**: Candidate coordinates `@knowledge-forge-ai/starlight-theme-terminal-nova@0.1.0` reflect release candidate composition, not live registry state.
