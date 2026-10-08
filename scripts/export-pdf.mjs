import { spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import { chromium } from "@playwright/test"

const port = process.env.PORT ?? "4173"
const baseUrl = `http://127.0.0.1:${port}`
const outputPath = process.env.PDF_OUTPUT ?? "artifacts/slides.pdf"
const npx = "npx"

const server =
  process.platform === "win32"
    ? spawn(
        "cmd.exe",
        ["/c", "npx", "http-server", "docs", "--port", port, "--silent"],
        { stdio: "inherit" },
      )
    : spawn(npx, ["http-server", "docs", "--port", port, "--silent"], {
        stdio: "inherit",
      })

const stopServer = () => {
  if (!server.killed) {
    server.kill()
  }
}

process.on("exit", stopServer)
process.on("SIGINT", () => {
  stopServer()
  process.exit(130)
})

try {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })

  await page.goto(baseUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  })
  await page.waitForSelector(".remark-slide-container", { timeout: 30_000 })
  await page.emulateMedia({ media: "screen" })

  const slideCount = await page.evaluate(() => window.slideshow.getSlideCount())
  const slideImages = []
  for (let slideIndex = 0; slideIndex < slideCount; slideIndex += 1) {
    await page.evaluate((index) => window.slideshow.gotoSlide(index + 1), slideIndex)
    await page.waitForFunction(
      (index) => window.slideshow.getCurrentSlideIndex() === index,
      slideIndex,
    )
    const image = await page.screenshot({ type: "png" })
    slideImages.push(`data:image/png;base64,${image.toString("base64")}`)
  }

  const pdfPage = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await pdfPage.setContent(`
    <!doctype html>
    <html>
      <head>
        <style>
          @page { size: 16in 9in; margin: 0; }
          html, body { margin: 0; padding: 0; }
          .slide-page {
            width: 16in;
            height: 9in;
            page-break-after: always;
          }
          .slide-page:last-child { page-break-after: auto; }
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${slideImages
          .map((src) => `<div class="slide-page"><img src="${src}" /></div>`)
          .join("")}
      </body>
    </html>
  `)

  await mkdir("artifacts", { recursive: true })
  await pdfPage.pdf({
    path: outputPath,
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
  })

  await browser.close()
} finally {
  stopServer()
}
