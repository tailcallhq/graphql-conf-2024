import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";

const DOCS_DIR = path.resolve(process.cwd(), "..", "docs");
const OUTPUT = process.argv[2] ?? "slides.pdf";
const WIDTH = 1280;
const HEIGHT = 720;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".md": "text/markdown",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = http.createServer(async (req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(DOCS_DIR, rel === "/" ? "index.html" : rel);
  if (!file.startsWith(DOCS_DIR) || !existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, {
    "content-type": MIME[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(await readFile(file));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});

await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
await page.waitForSelector(".remark-slides-area", { state: "attached" });
await page.waitForFunction(
  () => window.slideshow && window.slideshow.getSlides().length > 0,
);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2500);

const total = await page.evaluate(() => window.slideshow.getSlides().length);
console.log(`slide count: ${total}`);

const currentSlideNo = () =>
  page.evaluate(() => window.slideshow.getCurrentSlideIndex() + 1);

const shots = [];
let mismatches = 0;
for (let i = 1; i <= total; i++) {
  await page.evaluate((n) => window.slideshow.gotoSlide(n), i);
  await page.waitForTimeout(350);
  const actual = await currentSlideNo();
  if (actual !== i) {
    mismatches++;
    console.log(`WARNING: slide ${i} shows ${actual}`);
  }
  shots.push(await page.screenshot({ type: "png" }));
  console.log(`captured slide ${i}/${total}`);
}

await browser.close();
server.close();

const pdf = await PDFDocument.create();
for (const shot of shots) {
  const image = await pdf.embedPng(shot);
  const pdfPage = pdf.addPage([WIDTH, HEIGHT]);
  pdfPage.drawImage(image, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
}

const bytes = await pdf.save();
await writeFile(OUTPUT, bytes);
console.log(
  `wrote ${OUTPUT} (${bytes.length} bytes, ${shots.length} slides, ${mismatches} mismatches)`,
);
