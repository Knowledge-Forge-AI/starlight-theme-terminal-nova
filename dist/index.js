function deepCloneSafe(val) {
    if (Array.isArray(val))
        return val.map(deepCloneSafe);
    if (val === null || typeof val !== "object")
        return val;
    const result = {};
    for (const key of Object.keys(val)) {
        if (["__proto__", "prototype", "constructor"].includes(key))
            continue;
        Object.defineProperty(result, key, { value: deepCloneSafe(val[key]), enumerable: true, writable: true, configurable: true });
    }
    return result;
}
function mergeCodeConfig(defaults, consumer) {
    if (consumer === false)
        return false;
    if (consumer === undefined || consumer === true)
        return deepCloneSafe(defaults);
    if (consumer === null || typeof consumer !== "object" || Array.isArray(consumer))
        return consumer;
    const proto = Object.getPrototypeOf(consumer);
    if (proto !== Object.prototype && proto !== null)
        return consumer;
    if (defaults === null || typeof defaults !== "object" || Array.isArray(defaults))
        return consumer;
    const result = deepCloneSafe(defaults);
    for (const key of Reflect.ownKeys(consumer)) {
        if (typeof key === "string" && ["__proto__", "prototype", "constructor"].includes(key))
            continue;
        const descriptor = Object.getOwnPropertyDescriptor(consumer, key);
        if (!descriptor)
            continue;
        if (!("value" in descriptor)) {
            Object.defineProperty(result, key, descriptor);
            continue;
        }
        const value = descriptor.value;
        if (value === undefined)
            continue;
        const themeValue = Object.hasOwn(defaults, key) ? defaults[key] : undefined;
        const branch = themeValue !== null && typeof themeValue === "object" && !Array.isArray(themeValue);
        const merged = branch && value !== true ? mergeCodeConfig(themeValue, value) : value;
        Object.defineProperty(result, key, { ...descriptor, value: merged });
    }
    return result;
}
export default function themePlugin() {
    return {
        name: "@knowledge-forge-ai/starlight-theme-terminal-nova",
        hooks: {
            "config:setup"({ config, updateConfig, addRouteMiddleware }) {
                const defaults = ["@knowledge-forge-ai/starlight-theme-terminal-nova/styles/layers.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/tokens.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/base.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/accent.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/overrides.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/code.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/compat.css", "@knowledge-forge-ai/starlight-theme-terminal-nova/styles/book.css"];
                const customCss = [
                    ...defaults,
                    ...(Array.isArray(config?.customCss) ? config.customCss : []).filter((path) => !defaults.includes(path)),
                ];
                const components = {
                    Hero: "@knowledge-forge-ai/starlight-theme-terminal-nova/components/Hero.astro",
                    PageTitle: "@knowledge-forge-ai/starlight-theme-terminal-nova/components/PageTitle.astro",
                    Pagination: "@knowledge-forge-ai/starlight-theme-terminal-nova/components/Pagination.astro",
                    Sidebar: "@knowledge-forge-ai/starlight-theme-terminal-nova/components/Sidebar.astro",
                    ...(config?.components ?? {})
                };
                addRouteMiddleware({ entrypoint: "@knowledge-forge-ai/starlight-theme-terminal-nova/middleware.js", order: "default" });
                const ecDefaults = { "themes": [{ "name": "terminal-nova-dark", "type": "dark", "bg": "#15181e", "fg": "#eee9e3", "tokenColors": [{ "scope": ["keyword"], "settings": { "foreground": "#f1a8cd" } }, { "scope": ["string"], "settings": { "foreground": "#83d9dd" } }, { "scope": ["comment"], "settings": { "foreground": "#b9b4ad" } }, { "scope": ["entity.name.function"], "settings": { "foreground": "#ffac75" } }, { "scope": ["variable"], "settings": { "foreground": "#c6b2f3" } }, { "scope": ["constant"], "settings": { "foreground": "#e5cf8a" } }] }, { "name": "terminal-nova-light", "type": "light", "bg": "#faf1e8", "fg": "#262a33", "tokenColors": [{ "scope": ["keyword"], "settings": { "foreground": "#8d3267" } }, { "scope": ["string"], "settings": { "foreground": "#126475" } }, { "scope": ["comment"], "settings": { "foreground": "#625a55" } }, { "scope": ["entity.name.function"], "settings": { "foreground": "#9c3e0b" } }, { "scope": ["variable"], "settings": { "foreground": "#524598" } }, { "scope": ["constant"], "settings": { "foreground": "#756014" } }] }], "useStarlightUiThemeColors": false, "defaultProps": { "frame": "code" }, "styleOverrides": { "codeFontFamily": "var(--tfsl-font-code)", "codeFontSize": "14px", "codeLineHeight": "1.6", "borderRadius": "4px", "borderWidth": "1px", "borderColor": ["#50535d", "#9d9187"], "focusBorder": ["#ff8a3d", "#9c3e0b"], "codeBackground": ["#15181e", "#faf1e8"], "codeForeground": ["#eee9e3", "#262a33"], "frames": { "editorBackground": ["#15181e", "#faf1e8"], "editorActiveTabBackground": ["#15181e", "#faf1e8"], "editorActiveTabForeground": ["#eee9e3", "#262a33"], "editorActiveTabBorderColor": ["#50535d", "#9d9187"], "editorTabBarBackground": ["#191c23", "#fffdfa"], "editorTabBarBorderColor": ["#50535d", "#9d9187"], "editorTabBarBorderBottomColor": ["#50535d", "#9d9187"], "editorTabBorderRadius": "4px", "terminalBackground": ["#15181e", "#faf1e8"], "terminalTitlebarBackground": ["#191c23", "#fffdfa"], "terminalTitlebarForeground": ["#ddd7d0", "#33343b"], "terminalTitlebarBorderBottomColor": ["#50535d", "#9d9187"], "inlineButtonForeground": ["#ddd7d0", "#33343b"], "inlineButtonBorder": ["#50535d", "#9d9187"], "inlineButtonBorderOpacity": "0.4", "inlineButtonBackgroundIdleOpacity": "0", "tooltipSuccessBackground": ["#ff8a3d", "#9c3e0b"], "tooltipSuccessForeground": ["#111318", "#fff8f0"] }, "textMarkers": { "markBackground": ["#bf771d", "#bf771d"], "markBorderColor": ["#bf771d", "#bf771d"], "insBackground": ["#25834b", "#25834b"], "insBorderColor": ["#25834b", "#25834b"], "insDiffIndicatorColor": ["#25834b", "#25834b"], "delBackground": ["#c44848", "#c44848"], "delBorderColor": ["#c44848", "#c44848"], "delDiffIndicatorColor": ["#c44848", "#c44848"] } } };
                const expressiveCode = mergeCodeConfig(ecDefaults, config?.expressiveCode);
                updateConfig({ customCss, components, expressiveCode });
            }
        }
    };
}
//# sourceMappingURL=index.js.map