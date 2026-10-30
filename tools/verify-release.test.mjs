import { test } from "node:test";
import assert from "node:assert/strict";
import { chmod, cp, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { verifyRelease } from "./verify-release.mjs";

const root = process.cwd();
async function fixture(run) {
  const temporary = await mkdtemp(join(tmpdir(), "nova-release-negative-"));
  try {
    const provenance = JSON.parse(await readFile(join(root, "provenance.json"), "utf8"));
    for (const path of [...provenance.files.map(file => file.path), "provenance.json", "rc-inputs.json", "graphics", "demo/public/art"]) {
      await cp(join(root, path), join(temporary, path), { recursive: true });
    }
    await run(temporary);
  } finally { await rm(temporary, { recursive: true, force: true }); }
}

test("release members, generated tree binding and six served graphics verify", async () => {
  assert.equal((await verifyRelease(root)).canonicalGraphics, 6);
});

test("stale generated package tree binding fails", async () => fixture(async temporary => {
  const inputs = JSON.parse(await readFile(join(temporary, "rc-inputs.json"), "utf8"));
  inputs.generatedPackageTreeDigest = "d19d543c419b9f84499680f4355053d798d3cb3729d6cc64cfc22ffc07bd922f";
  await writeFile(join(temporary, "rc-inputs.json"), JSON.stringify(inputs));
  await assert.rejects(verifyRelease(temporary), /Generated package tree digest mismatch/);
}));

test("provenance bytes participate in generated tree binding", async () => fixture(async temporary => {
  const path = join(temporary, "provenance.json");
  await writeFile(path, (await readFile(path, "utf8")) + "\n");
  await assert.rejects(verifyRelease(temporary), /Generated package tree digest mismatch/);
}));

test("an undeclared generated package member fails", async () => fixture(async temporary => {
  await writeFile(join(temporary, "dist/unlisted.js"), "export {};\n");
  await assert.rejects(verifyRelease(temporary), /Generated package member set mismatch/);
}));

test("a missing generated member fails", async () => fixture(async temporary => {
  await rm(join(temporary, "dist/index.js"));
  await assert.rejects(verifyRelease(temporary));
}));

test("generated member content tampering fails", async () => fixture(async temporary => {
  await writeFile(join(temporary, "dist/index.js"), "tampered");
  await assert.rejects(verifyRelease(temporary), /Generated member size mismatch/);
}));

test("actual generated member modes participate in tree binding", async () => fixture(async temporary => {
  await chmod(join(temporary, "dist/index.js"), 0o755);
  await assert.rejects(verifyRelease(temporary), /Generated package tree digest mismatch/);
}));

test("served graphic tampering fails", async () => fixture(async temporary => {
  const graphic = JSON.parse(await readFile(join(root, "graphics/manifest.json"), "utf8")).scenes[0].svgFile;
  await writeFile(join(temporary, "demo/public/art", graphic), "tampered");
  await assert.rejects(verifyRelease(temporary), /Served graphic mismatch/);
}));

test("provenance cannot omit an actual member even with a recomputed inventory digest", async () => fixture(async temporary => {
  const path = join(temporary, "provenance.json");
  const provenance = JSON.parse(await readFile(path, "utf8"));
  provenance.files = provenance.files.filter(file => file.path !== "dist/index.js");
  provenance.inventoryDigest = createHash("sha256").update("tfsl.package-inventory-v2\n" + JSON.stringify(provenance.files)).digest("hex");
  await writeFile(path, JSON.stringify(provenance));
  await assert.rejects(verifyRelease(temporary), /Generated package member set mismatch/);
}));

test("generated package symlinks fail", async () => fixture(async temporary => {
  await symlink("index.js", join(temporary, "dist/unlisted.js"));
  await assert.rejects(verifyRelease(temporary), /Unexpected generated package symlink/);
}));
