import { getYouCamRuntime } from "./youcam";

export type AppMode = "demo" | "live";

export function getAppMode(): AppMode {
  const runtime = getYouCamRuntime();
  return runtime.shouldMock ? "demo" : "live";
}
