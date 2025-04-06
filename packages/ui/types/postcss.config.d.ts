import type { Config } from "postcss-load-config";

declare module "@repo/ui/postcss.config" {
  const config: Config;
  export default config;
}
