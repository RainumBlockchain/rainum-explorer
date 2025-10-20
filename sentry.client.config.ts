import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://62bab305ef984580b5e0b39ce5fca913@o4510188824559616.ingest.us.sentry.io/4510188825870336",
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
