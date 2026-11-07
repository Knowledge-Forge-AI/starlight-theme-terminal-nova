import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

const scenario = process.env.CONSUMER_SCENARIO || "nova";
const disconnected = scenario === "nova-disconnected";
const override = scenario === "nova-override";
const codeDisabled = scenario === "nova-code-disabled" || process.env.CONSUMER_CODE_DISABLED === "true";
const outDir = process.env.ASTRO_OUT_DIR || "./dist";
const packageName = process.env.THEME_PACKAGE_NAME || "@knowledge-forge-ai/starlight-theme-terminal-nova";
const siteUrl = "https://sttn.knowledge-forge.ai";
const siteDescription =
  "A practical Astro Starlight theme for readable technical documentation, focused code, and terminal-inspired navigation chrome.";
const socialImageUrl = `${siteUrl}/brand/sttn-social.png`;

const plugins = [];
if (!disconnected) {
  const mod = await import(packageName);
  const themePlugin = mod.default || mod.terminalNova || mod;
  if (typeof themePlugin !== "function") {
    throw new Error(`Theme package ${packageName} does not export a valid plugin function`);
  }
  plugins.push(themePlugin());
}

const customCss = [];
if (override) {
  customCss.push("./src/styles/consumer-custom.css");
}

export default defineConfig({
  site: siteUrl,
  outDir,
  server: {
    host: "127.0.0.1",
  },
  integrations: [
    starlight({
      title: "Terminal Nova",
      description: siteDescription,
      plugins,
      expressiveCode: codeDisabled ? false : undefined,
      components: override ? { PageTitle: "./src/components/ConsumerPageTitle.astro" } : {},
      customCss,
      logo: {
        light: "./public/brand/theme-forge-terminal-nova-mark-on-light.svg",
        dark: "./public/brand/theme-forge-terminal-nova-mark-on-dark.svg",
        replacesTitle: false,
      },
      favicon: "/brand/favicon-on-light.svg",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/svg+xml",
            href: "/brand/favicon-on-dark.svg",
            media: "(prefers-color-scheme: dark)",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: socialImageUrl,
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:type",
            content: "image/png",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:width",
            content: "1200",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:height",
            content: "630",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:alt",
            content: "Starlight Theme Terminal Nova documentation theme with focused code and terminal-inspired navigation",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:card",
            content: "summary_large_image",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: socialImageUrl,
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image:type",
            content: "image/png",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image:width",
            content: "1200",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image:height",
            content: "630",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image:alt",
            content: "Starlight Theme Terminal Nova documentation theme with focused code and terminal-inspired navigation",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "referrer",
            content: "strict-origin-when-cross-origin",
          },
        },
      ],
      pagination: true,
      sidebar: [
        {
          label: "Overview",
          items: [
            { label: "Welcome", slug: "index" },
            { label: "Architecture Overview", slug: "overview" },
            { label: "Getting Started", slug: "docs/getting-started" },
          ],
        },
        {
          label: "Documentation",
          items: [
            { label: "Engine Workflow", slug: "docs/workflow" },
            { label: "Component Gallery", slug: "docs/components" },
            { label: "Appearance Families", slug: "docs/appearance-families" },
            { label: "Brand and License", slug: "docs/brand-and-license" },
          ],
        },
      ],
    }),
  ],
});
