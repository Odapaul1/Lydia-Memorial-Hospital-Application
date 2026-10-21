// Production entry point. Sets NODE_ENV before the server modules load so the
// server serves the built assets from dist/ instead of the Vite dev middleware.
process.env.NODE_ENV = "production";

export {};

await import("./index");
