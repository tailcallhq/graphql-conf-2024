import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const docsDir = path.join(root, "docs");
const outputDir = path.join(root, "dist");
const outputFile = path.join(outputDir, "graphql-conf-2024-slides.pdf");

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".md", "text/markdown; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

async function serveFile(req, res) {
  try {
    const requestedPath = new URL(req.url ?? "/", "http://127.0.0.1")
      .pathname;
    const relativePath = decodeURIComponent(requestedPath).replace(/^\/+/, "");
    const resolvedPath = path.resolve(
      docsDir,
      relativePath === "" ? "index.html" : relativePath,
    );

    if (!resolvedPath.startsWith(`${docsDir}${path.sep}`)) {
      send(res, 403, "Forbidden");
      return;
    }

    const fileStat = await stat(resolvedPath);
    if (!fileStat.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    send(res, 200, await readFile(resolvedPath), {
      "Content-Type":
        mimeTypes.get(path.extname(resolvedPath)) ??
        "application/octet-stream",
    });
  } catch (error) {
    if (error?.code === "ENOENT") {
      send(res, 404, "Not found");
      return;
    }

    console.error(error);
    send(res, 500, "Internal server error");
  }
}

async function startServer() {
  const server = createServer(serveFile);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    stop: () => new Promise((resolve) => server.close(resolve)),
  };
}

const server = await startServer();
const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });

try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(`${server.origin}/index.html?print-pdf`, {
    waitUntil: "load",
    timeout: 60_000,
  });

  await page.waitForFunction(
    () =>
      window.slideshow &&
      document.querySelectorAll(".remark-slide-container").length > 0,
    { timeout: 60_000 },
  );

  await page.evaluate(async () => {
    await document.fonts?.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
        ),
    );
  });

  await page.addStyleTag({
    content: `
      @page {
        size: 16in 9in;
        margin: 0;
      }

      html,
      body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
  });

  await mkdir(outputDir, { recursive: true });
  await page.pdf({
    path: outputFile,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  console.log(`Generated ${path.relative(root, outputFile)}`);
} finally {
  await browser.close();
  await server.stop();
}
