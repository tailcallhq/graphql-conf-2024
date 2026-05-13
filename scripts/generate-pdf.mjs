import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { chromium } from "playwright";

const rootDir = resolve(import.meta.dirname, "..");
const docsDir = join(rootDir, "docs");
const outputDir = join(rootDir, "dist");
const outputName = "dist/graphql-conf-2024-slides.pdf";
const outputFile = join(outputDir, "graphql-conf-2024-slides.pdf");
const requestedPort = Number.parseInt(process.env.PDF_SERVER_PORT ?? "0", 10);
let serverPort = requestedPort;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function filePathForRequest(url) {
  const requestUrl = new URL(url, `http://127.0.0.1:${serverPort}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(docsDir, requestedPath));

  if (filePath !== docsDir && !filePath.startsWith(`${docsDir}${sep}`)) {
    return undefined;
  }

  return filePath;
}

const server = createServer((request, response) => {
  const filePath = filePathForRequest(request.url ?? "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const stream = createReadStream(filePath);

  stream.on("open", () => {
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    stream.pipe(response);
  });

  stream.on("error", () => {
    response.writeHead(404);
    response.end("Not found");
  });
});

await mkdir(outputDir, { recursive: true });

await new Promise((resolveListen, rejectListen) => {
  server.once("error", rejectListen);
  server.listen(requestedPort, "127.0.0.1", () => {
    const address = server.address();
    serverPort = typeof address === "object" && address ? address.port : requestedPort;
    resolveListen();
  });
});

const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { width: 1210, height: 681 },
  });

  page.setDefaultTimeout(30000);

  await page.goto(`http://127.0.0.1:${serverPort}/index.html?print-pdf`, {
    waitUntil: "networkidle",
  });

  await page.waitForFunction(() => {
    return window.slideshow && document.querySelectorAll(".remark-slide-container").length > 0;
  });

  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
  await page.evaluate(() => document.fonts?.ready);

  await page.pdf({
    path: outputFile,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });

  console.log(`Generated ${outputName}`);
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
