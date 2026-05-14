Slides for the Talk "Scaling GraphQL for 500,000,000 req/min"

---

# Get Started

```
npx live-server docs
```

# Generate PDF

Every push and pull request generates a PDF artifact from the HTML slides.
To generate it locally:

```
npm install --no-save playwright
npx playwright install chromium
node scripts/generate-pdf.mjs
```
