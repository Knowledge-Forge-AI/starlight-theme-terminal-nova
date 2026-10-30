import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const localPath = path => {
  assert(typeof path === "string" && !path.startsWith("/") && !path.includes("\\") &&
    path.split("/").every(part => part && part !== "." && part !== ".."), "Invalid release member path");
  return path;
};

// Match composition-policy.mjs computeTreeInventory: sorted path/size/mode/sha256
// records, actual permission bits masked by 0777, JSON bytes and no hash prefix.
// Only generated package roots belong here; demo and release inputs are outside
// the generated tree. The provenance file itself is an additional tree member.
async function generatedPackageInventory(root, pkg) {
  const files = [];
  async function walk(path) {
    const fullPath = join(root, localPath(path));
    const info = await lstat(fullPath);
    assert(!info.isSymbolicLink(), "Unexpected generated package symlink");
    if (info.isDirectory()) {
      const entries = await readdir(fullPath);
      entries.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      for (const entry of entries) await walk(`${path}/${entry}`);
    } else {
      assert(info.isFile(), "Unsupported generated package member type");
      files.push({ path, size: info.size, mode: info.mode & 0o777, sha256: digest(await readFile(fullPath)) });
    }
  }
  const roots = new Set([...pkg.files, "package.json", "provenance.json"]);
  for (const path of roots) {
    // This package declares literal top-level members, not npm glob patterns.
    assert(localPath(path) === path && !/[/*?\[\]]/.test(path), "Unsupported generated package root");
    try { await lstat(join(root, path)); }
    catch (error) {
      // Optional empty fonts/licenses directories are absent from generated output.
      if (error.code === "ENOENT" && ["fonts", "licenses"].includes(path)) continue;
      throw error;
    }
    await walk(path);
  }
  files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return files;
}

export async function verifyRelease(root) {
  const readJson = async path => JSON.parse(await readFile(join(root, path), "utf8"));
  const pkg = await readJson("package.json");
  assert.equal(pkg.name, "@knowledge-forge-ai/starlight-theme-terminal-nova");
  assert.equal(pkg.version, "0.4.0");
  assert(!/release candidate/i.test(pkg.description));
  assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);
  const provenance = await readJson("provenance.json");
  assert.equal(provenance.schema, "tfsl.package-provenance-v2");
  assert.equal(provenance.producer.package, "@knowledge-forge-ai/theme-forge-stellar-loom");
  assert.equal(provenance.producer.version, "0.5.0");
  assert.equal(provenance.packageName, pkg.name);
  assert.deepEqual(provenance.inventoryExcludes, ["provenance.json"]);
  assert.equal(provenance.packageVersion, "0.4.0");
  assert.equal(new Set(provenance.files.map(file => file.path)).size, provenance.files.length);
  for (const file of provenance.files) {
    const bytes = await readFile(join(root, localPath(file.path)));
    assert.equal(bytes.length, file.size, "Generated member size mismatch");
    assert.equal(digest(bytes), file.sha256, "Generated member digest mismatch");
  }
  assert.equal(digest("tfsl.package-inventory-v2\n" + JSON.stringify(provenance.files)), provenance.inventoryDigest);
  const inputs = await readJson("rc-inputs.json");
  const generatedFiles = await generatedPackageInventory(root, pkg);
  assert.deepEqual(generatedFiles.map(file => file.path),
    [...provenance.files.map(file => localPath(file.path)), "provenance.json"].sort(),
    "Generated package member set mismatch");
  assert.equal(digest(JSON.stringify(generatedFiles)), inputs.generatedPackageTreeDigest,
    "Generated package tree digest mismatch");
  const manifest = await readJson("graphics/manifest.json");
  const qualification = await readJson("graphics/rc-qualification.json");
  const currentQualification = await readJson("graphics/rc-qualification-0.4.0.json");
  assert.equal(manifest.scenes.length, 6);
  assert.equal(new Set(manifest.scenes.map(scene => scene.id)).size, 6);
  // Historical 0.3-era requalification is preserved, not relabelled.
  assert.equal(qualification.compilerVersion, "0.5.0");
  // Current 0.4.0 requalification is bound to the current Burst input.
  assert.equal(currentQualification.compilerVersion, "0.7.0");
  assert.equal(currentQualification.artifactSha256, inputs.burst.sha256);
  assert.equal(inputs.burst.version, "0.7.0");
  assert.equal(inputs.compiler.version, "0.5.0");
  for (const scene of manifest.scenes) {
    assert.equal(basename(scene.svgFile), scene.svgFile);
    const bytes = await readFile(join(root, "graphics", scene.svgFile));
    assert.equal("sha256:" + digest(bytes), scene.svgDigest, "Canonical graphic digest mismatch");
    assert.deepEqual(bytes, await readFile(join(root, "demo/public/art", scene.svgFile)), "Served graphic mismatch");
    assert.equal(qualification.scenes.find(item => item.id === scene.id)?.svgDigest, scene.svgDigest);
    assert.equal(currentQualification.scenes.find(item => item.id === scene.id)?.svgDigest, scene.svgDigest);
  }
  return { version: pkg.version, generatedMembers: provenance.files.length, canonicalGraphics: 6 };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ? resolve(process.argv[2]) : resolve(dirname(fileURLToPath(import.meta.url)), "..");
  console.log(JSON.stringify(await verifyRelease(root)));
}
