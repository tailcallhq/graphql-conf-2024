import fs from 'fs/promises';

async function preprocessMarkdown() {
  const input = await fs.readFile('./docs/slides.md', 'utf-8');
  const processed = input
    .replace(/^##\s*(.*?)$/gm, '<p class="h2">$1</p>')
    .replace(/^#\s*(.*?)$/gm, '<p class="h1">$1</p>');
  
  await fs.writeFile('./docs/processed-slides.md', processed);
}

preprocessMarkdown().catch(console.error);