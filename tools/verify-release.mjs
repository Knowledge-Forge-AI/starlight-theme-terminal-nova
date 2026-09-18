import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const localPath = path => {
  assert(typeof path === "string" && !path.startsWith("/") && !path.includes("\\") &&
    path.split("/").every(part => part && part !== "." && part !== ".."), "Invalid release member path");
  return path;
};

export async function verifyRelease(root) {
  const readJson = async path => JSON.parse(await readFile(join(root, path), "utf8"));
  const pkg = await readJson("package.json");
  assert.equal(pkg.name, "@knowledge-forge-ai/starlight-theme-terminal-nova");
  assert.equal(pkg.version, "0.3.0");
  assert(!/release candidate/i.test(pkg.description));
  assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);
  const provenance = await readJson("provenance.json");
  assert.equal(provenance.producer.version, "0.3.0");
  assert.equal(new Set(provenance.files.map(file => file.path)).size, provenance.files.length);
  for (const file of provenance.files) {
    const bytes = await readFile(join(root, localPath(file.path)));
    assert.equal(bytes.length, file.size, "Generated member size mismatch");
    assert.equal(digest(bytes), file.sha256, "Generated member digest mismatch");
  }
  assert.equal(digest("tfsl.package-inventory-v2\n" + JSON.stringify(provenance.files)), provenance.inventoryDigest);
  const inputs = await readJson("rc-inputs.json");
  const manifest = await readJson("graphics/manifest.json");
  const qualification = await readJson("graphics/rc-qualification.json");
  assert.equal(manifest.scenes.length, 6);
  assert.equal(new Set(manifest.scenes.map(scene => scene.id)).size, 6);
  assert.equal(qualification.compilerVersion, "0.5.0");
  assert.equal(qualification.artifactSha256, inputs.burst.sha256);
  assert.equal(inputs.compiler.version, "0.3.0");
  for (const scene of manifest.scenes) {
    assert.equal(basename(scene.svgFile), scene.svgFile);
    const bytes = await readFile(join(root, "graphics", scene.svgFile));
    assert.equal("sha256:" + digest(bytes), scene.svgDigest, "Canonical graphic digest mismatch");
    assert.deepEqual(bytes, await readFile(join(root, "demo/public/art", scene.svgFile)), "Served graphic mismatch");
    assert.equal(qualification.scenes.find(item => item.id === scene.id)?.svgDigest, scene.svgDigest);
  }
  return { version: pkg.version, generatedMembers: provenance.files.length, canonicalGraphics: 6 };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ? resolve(process.argv[2]) : resolve(dirname(fileURLToPath(import.meta.url)), "..");
  console.log(JSON.stringify(await verifyRelease(root)));
}
