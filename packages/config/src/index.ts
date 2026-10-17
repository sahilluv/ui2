export const appConfig = {
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

export type AppConfig = typeof appConfig;
