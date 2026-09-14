export default function themePlugin(): {
  name: string;
  hooks: {
    'config:setup'(context: {
      config?: {
        customCss?: string[];
        components?: Record<string, string>;
        expressiveCode?: unknown;
      };
      updateConfig(config: unknown): void;
      addRouteMiddleware?(options: { entrypoint: string; order?: 'default' | 'pre' | 'post' }): void;
    }): void;
  };
};
