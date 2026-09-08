import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Private smoke runs overlay the consumer fixture. The standalone composition
// selects the kitchen-sink fixture's package.json/lock and consumer support files.
const scenario = process.env.CONSUMER_SCENARIO ?? "nova";
const disconnected = scenario === "nova-disconnected";
const override = scenario === "nova-override";
const plugins = [];
if (!disconnected) {
  const { default: terminalNova } = await import("@knowledge-forge-ai/starlight-theme-terminal-nova");
  plugins.push(terminalNova());
}

export default defineConfig({
  outDir: process.env.ASTRO_OUT_DIR ?? "./dist",
  integrations: [
    starlight({
      title: "Terminal Nova",
      plugins,
      components: override ? { PageTitle: "./src/components/ConsumerPageTitle.astro" } : {},
      customCss: override ? ["./src/styles/consumer-custom.css"] : [],
      logo: {
        light: "./public/brand/theme-forge-terminal-nova-mark-on-light.svg",
        dark: "./public/brand/theme-forge-terminal-nova-mark-on-dark.svg",
        replacesTitle: false,
      },
      favicon: "/brand/favicon-on-light.svg",
      head: [{
        tag: "link",
        attrs: {
          rel: "icon", type: "image/svg+xml",
          href: "/brand/favicon-on-dark.svg",
          media: "(prefers-color-scheme: dark)",
        },
      }],
      sidebar: [{
        label: "Workspace",
        items: [{ label: "Overview", slug: "index" }, { label: "Design notes", slug: "design" }],
      }],
    }),
  ],
});
