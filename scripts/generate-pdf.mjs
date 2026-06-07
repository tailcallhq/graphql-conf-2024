import http from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const docsDir = join(projectRoot, "docs");

function contentType(pathname) {
  const ext = extname(pathname).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".md") return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const cleaned = decoded.replace(/^\/+/, "");
  if (!cleaned || cleaned.endsWith("/")) return "index.html";
  return cleaned;
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = safePath(req.url ?? "/");
      const filePath = join(docsDir, pathname);
      const data = await readFile(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType(filePath));
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("Could not start server");
  return { server, port: addr.port };
}

async function main() {
  const outPath = process.env.PDF_OUT ?? join(projectRoot, "artifacts", "graphql-conf-2024-slides.pdf");
  await mkdir(dirname(outPath), { recursive: true });

  const { server, port } = await startServer();
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });

    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.includes("google-analytics.com") || url.includes("googletagmanager.com")) {
        await route.abort();
        return;
      }
      await route.continue();
    });

    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle" });

    await page.waitForFunction(() => {
      const anyWindow = window;
      const s = anyWindow.slideshow;
      return !!(s && typeof s.getSlides === "function" && s.getSlides().length > 0);
    });

    await page.addStyleTag({
      content: `
        @media print {
          html, body { background: #000 !important; }
          .remark-slide-container { page-break-after: always; }
          .remark-slide-container:last-child { page-break-after: auto; }
        }
      `,
    });

    await page.emulateMedia({ media: "print" });

    await page.pdf({
      path: outPath,
      printBackground: true,
      landscape: true,
      width: "13.333in",
      height: "7.5in"
    });

    await browser.close();
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

await main();
