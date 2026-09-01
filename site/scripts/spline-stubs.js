// Spline runtime package (@splinetool/runtime) references several draco/boolean
// WASM and JS files via new URL() that don't exist in the npm package. The
// runtime fetches these from Spline's CDN at runtime, so we create lightweight
// stubs at build time so webpack resolves them. This runs after every
// `npm install` (including Vercel builds) so the stubs are never lost.

"use strict";
const fs = require("fs");
const path = require("path");

const runtimeBuild = path.join(
  __dirname,
  "..",
  "node_modules",
  "@splinetool",
  "runtime",
  "build"
);
const runtimeRoot = path.join(
  __dirname,
  "..",
  "node_modules",
  "@splinetool",
  "runtime"
);

// Minimal valid WebAssembly binary: magic "\0asm" + version 1, empty section.
const wasmStub = (() => {
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(0x6d736100, 0); // \0asm
  buf.writeUInt32BE(1, 4); // version 1
  return buf;
})();

const jsStub = `export default {};
export const __esModule = true;
`;

function writeIfMissing(p, content) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  }
}

// draco files referenced from runtime-DRACOLoader-*.js
const dracoRoot = path.join(runtimeRoot, "libs", "draco");
writeIfMissing(path.join(dracoRoot, "draco_decoder.js"), jsStub);
writeIfMissing(path.join(dracoRoot, "draco_wasm_wrapper.js"), jsStub);
writeIfMissing(path.join(dracoRoot, "gltf", "draco_decoder.wasm"), wasmStub);
writeIfMissing(path.join(dracoRoot, "gltf", "draco_decoder.js"), jsStub);
writeIfMissing(path.join(dracoRoot, "gltf", "draco_wasm_wrapper.js"), jsStub);
writeIfMissing(path.join(dracoRoot, "draco_decoder.wasm"), wasmStub);

// boolean_wasm_bg.wasm referenced from boolean.js
writeIfMissing(path.join(runtimeBuild, "boolean_wasm_bg.wasm"), wasmStub);