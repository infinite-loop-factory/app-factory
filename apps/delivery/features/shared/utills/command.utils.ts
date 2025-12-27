import type { ExecSyncOptionsWithBufferEncoding } from "node:child_process";

import { execSync } from "node:child_process";

export const runCommand = (
  command: string,
  _options: ExecSyncOptionsWithBufferEncoding,
) => {
  try {
    execSync(command, { stdio: "inherit", ..._options });
  } catch (error: unknown) {
    console.error(
      error instanceof Error
        ? `Error: ${error.message}`
        : "An unknown error occurred",
    );
    process.exit(1);
  }
};
