import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const outputName = "dist/graphql-conf-2024-slides.pdf";
const outputFile = join(rootDir, outputName);
const minimumBytes = 100_000;

const pdf = await readFile(outputFile);
const header = pdf.subarray(0, 5).toString("ascii");

if (header !== "%PDF-") {
  throw new Error(`${outputName} is not a PDF file`);
}

if (pdf.byteLength < minimumBytes) {
  throw new Error(`${outputName} is unexpectedly small (${pdf.byteLength} bytes)`);
}

const text = pdf.toString("latin1");
const pageCount = (text.match(/\/Type\s*\/Page\b/g) ?? []).length;

if (pageCount < 1) {
  throw new Error(`${outputName} does not contain any PDF pages`);
}

console.log(`Verified ${outputName}: ${pageCount} pages, ${pdf.byteLength} bytes`);
