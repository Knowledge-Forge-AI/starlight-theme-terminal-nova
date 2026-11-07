/**
 * Compact build-owned catalog for the static appearance specimens.
 *
 * The public catalog.json and six CSS projections are supplied alongside this
 * demo build. Keeping this closed list in source lets route generation,
 * middleware, and the selector share one allowlist without runtime discovery.
 */
export const APPEARANCE_CATALOG = [
  { id: "terminal-nova", label: "Terminal Nova", review: "Development preview" },
  { id: "nebular", label: "Nebular", review: "Development preview" },
  { id: "developer", label: "Developer", review: "Development preview" },
  { id: "graphic-designer", label: "Graphic Designer", review: "Development preview" },
  { id: "anime", label: "Anime", review: "Development preview" },
  { id: "gamer", label: "Gamer", review: "Development preview" },
] as const;

export const APPEARANCE_MODES = ["light", "dark"] as const;

export type AppearanceFamily = (typeof APPEARANCE_CATALOG)[number];
export type AppearanceFamilyId = AppearanceFamily["id"];
export type AppearanceMode = (typeof APPEARANCE_MODES)[number];

export function getAppearanceFamily(value: unknown): AppearanceFamily | undefined {
  return APPEARANCE_CATALOG.find((family) => family.id === value);
}

export function isAppearanceFamilyId(value: unknown): value is AppearanceFamilyId {
  return getAppearanceFamily(value) !== undefined;
}

export function isAppearanceMode(value: unknown): value is AppearanceMode {
  return APPEARANCE_MODES.some((mode) => mode === value);
}
