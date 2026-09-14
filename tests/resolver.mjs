import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(".");

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
    for (const ext of [".ts", ".tsx", ".js", ".mjs", ".json"]) {
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
    for (const ext of [".ts", ".tsx", ".js", ".mjs", ".json"]) {
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
