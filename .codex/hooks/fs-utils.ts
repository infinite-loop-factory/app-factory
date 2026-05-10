import { sep } from "node:path";

/**
 * Normalize a filesystem path to POSIX (forward-slash) form so output
 * shown to the model and string comparisons stay platform-independent
 * on Windows. Mirrors `cli/utils/fs-utils.ts#toPosixPath`.
 */
export function toPosixPath(p: string): string {
  return sep === "/" ? p : p.split(sep).join("/");
}
