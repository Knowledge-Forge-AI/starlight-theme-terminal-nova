export interface NavigationLink {
    type: "link";
    label: string;
    href: string;
    current: boolean;
    title?: string | undefined;
    ariaLabel?: string | undefined;
}
export interface NavigationGroup {
    type: "group";
    label: string;
    entries: NavigationEntry[];
    current: boolean;
    collapsed: boolean;
}
export type NavigationEntry = NavigationLink | NavigationGroup;
export declare function safeHref(value: unknown): string;
export declare function localHref(value: unknown, base?: string): string;
export declare function text(value: unknown): string;
export declare function projectNavigation(entries: unknown[]): NavigationEntry[];
//# sourceMappingURL=navigation.d.ts.map