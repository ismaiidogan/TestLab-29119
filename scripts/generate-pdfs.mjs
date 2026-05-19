/**
 * Generate PDF deliverables from Markdown using Playwright print.
 * Usage: node scripts/generate-pdfs.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');

const files = [
  { md: 'USER_MANUAL.md', pdf: 'USER_MANUAL.pdf' },
  { md: 'TEACHING_EFFECTIVENESS.md', pdf: 'TEACHING_EFFECTIVENESS.pdf' },
];

const css = `
  @page { margin: 2cm; }
  body { font-family: 'Segoe UI', Georgia, serif; font-size: 11pt; line-height: 1.5; color: #111; max-width: 100%; }
  h1 { font-size: 22pt; border-bottom: 2px solid #00b4d8; padding-bottom: 0.3em; }
  h2 { font-size: 14pt; margin-top: 1.2em; color: #0077b6; }
  h3 { font-size: 12pt; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
  th { background: #f0f4f8; }
  code { background: #f4f4f4; padding: 1px 4px; font-size: 10pt; }
  hr { border: none; border-top: 1px solid #ddd; margin: 1.5em 0; }
  img { max-width: 100%; height: auto; display: block; margin: 0.75em auto; border: 1px solid #ddd; }
  h3 { page-break-after: avoid; }
`;

function mdToHtml(md) {
  const tmpIn = join(docs, '_tmp.md');
  const tmpOut = join(docs, '_tmp.html');
  writeFileSync(tmpIn, md, 'utf8');
  try {
    execSync(`npx --yes marked -i "${tmpIn}" -o "${tmpOut}"`, { cwd: root, stdio: 'pipe' });
    const body = readFileSync(tmpOut, 'utf8');
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>TestLab 29119</title><style>${css}</style></head><body>${body}</body></html>`;
  } finally {
    try { writeFileSync(tmpIn, ''); } catch (_) {}
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const { md, pdf } of files) {
  const mdPath = join(docs, md);
  const pdfPath = join(docs, pdf);
  const content = readFileSync(mdPath, 'utf8');
  const html = mdToHtml(content);
  const htmlPath = join(docs, pdf.replace('.pdf', '.html'));
  writeFileSync(htmlPath, html, 'utf8');
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            })
      )
    );
  }).catch(() => {});
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
  });
  console.log('Wrote', pdfPath);
}

await browser.close();
