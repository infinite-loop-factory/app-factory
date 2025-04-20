import { execSync } from "node:child_process";

export const runCommand = (command: string) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error: unknown) {
    console.error(
      error instanceof Error
        ? `Error: ${error.message}`
        : "An unknown error occurred",
    );
    process.exit(1);
  }
};
