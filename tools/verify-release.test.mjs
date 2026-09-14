import { test } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { verifyRelease } from "./verify-release.mjs";

test("release members and six served graphics verify; tampering fails", async () => {
  const root = process.cwd();
  assert.equal((await verifyRelease(root)).canonicalGraphics, 6);
  const temporary = await mkdtemp(join(tmpdir(), "nova-release-negative-"));
  try {
    const provenance = JSON.parse(await readFile(join(root, "provenance.json"), "utf8"));
    for (const path of [...provenance.files.map(file => file.path), "provenance.json", "rc-inputs.json", "graphics", "demo/public/art"]) {
      await cp(join(root, path), join(temporary, path), { recursive: true });
    }
    const graphic = JSON.parse(await readFile(join(root, "graphics/manifest.json"), "utf8")).scenes[0].svgFile;
    await writeFile(join(temporary, "demo/public/art", graphic), "tampered");
    await assert.rejects(verifyRelease(temporary), /Served graphic mismatch/);
  } finally { await rm(temporary, { recursive: true, force: true }); }
});
