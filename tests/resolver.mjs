import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * The project root, derived from this file's own location.
 *
 * It was `path.resolve(".")`, which resolves against the PROCESS's current
 * directory. `npm test` happens to run from the package root, so it worked — and
 * `node --import ./tests/register.mjs --test tests/smoke.test.ts` from anywhere
 * else silently failed to resolve `@/lib/lebron-data`, which is a confusing
 * failure rather than an honest one. Everything else in the suite derives its
 * root from `import.meta.dirname`; this was the exception.
 */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Extensions probed for an extensionless import.
 *
 * `.tsx` used to be in this list, and that is the documented cause of this
 * project's "no test imports a component" limitation: the resolver would happily
 * hand Node a `.tsx` file, and Node's TypeScript type-stripping then refuses it.
 * The limitation was real but the resolver was what made it reachable. With
 * `.tsx` gone, importing a component fails as "cannot find module", which is
 * what actually happened.
 */
const EXTENSIONS = [".ts", ".js", ".mjs", ".json"];

export async function resolve(specifier, context, nextResolve) {
  let target = specifier;

  // Handle '@/...' alias
  if (target.startsWith("@/")) {
    target = pathToFileURL(path.join(ROOT, target.slice(2))).href;
  }

  // If it's a relative path or file URL without extension
  const isRelative = target.startsWith("./") || target.startsWith("../");
  const isFileUrl = target.startsWith("file://");

  if (isRelative && context.parentURL) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const resolvedPath = path.resolve(parentDir, target);
    for (const ext of EXTENSIONS) {
      if (fs.existsSync(resolvedPath + ext)) {
        return nextResolve(pathToFileURL(resolvedPath + ext).href, context);
      }
      if (fs.existsSync(path.join(resolvedPath, "index" + ext))) {
        return nextResolve(pathToFileURL(path.join(resolvedPath, "index" + ext)).href, context);
      }
    }
  }

  if (isFileUrl) {
    const filePath = fileURLToPath(target);
    for (const ext of EXTENSIONS) {
      if (fs.existsSync(filePath + ext)) {
        return nextResolve(pathToFileURL(filePath + ext).href, context);
      }
      if (fs.existsSync(path.join(filePath, "index" + ext))) {
        return nextResolve(pathToFileURL(path.join(filePath, "index" + ext)).href, context);
      }
    }
  }

  return nextResolve(target, context);
}
