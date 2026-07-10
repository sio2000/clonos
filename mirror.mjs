// Static mirror of https://thepoumaacademy.com/ (WordPress + Enfold)
// Downloads HTML + all referenced assets (CSS, JS, images, fonts), recursing
// into CSS url()/@import, and rewrites URLs so the site works fully offline.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_URL = 'https://thepoumaacademy.com/';
const HOST = 'thepoumaacademy.com';
const OUT = path.resolve('C:/Users/theoharis/Desktop/pouma-clone/site');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const seen = new Set();
const queue = [];
let downloaded = 0, failed = 0;

// Map a remote URL -> local file path (relative to OUT) and disk path.
function localFor(u) {
  const url = new URL(u);
  let rel;
  if (url.host === HOST) {
    rel = url.pathname;
  } else {
    // external hosts (google fonts, gstatic, gtag) live under /_ext/<host>/
    rel = '/_ext/' + url.host + url.pathname;
  }
  if (rel.endsWith('/')) rel += 'index.html';
  // ensure something with no extension that's clearly a dir stays a file
  rel = decodeURIComponent(rel);
  const disk = path.join(OUT, rel.replace(/^\//, ''));
  return { rel, disk };
}

// Convert an absolute URL to a root-relative href usable in the mirror.
function rewriteRef(u) {
  try {
    const url = new URL(u);
    if (url.host === HOST) return url.pathname + url.search;
    return '/_ext/' + url.host + url.pathname + url.search;
  } catch { return u; }
}

async function fetchBuf(u) {
  const res = await fetch(u, { headers: { 'User-Agent': UA, 'Accept': '*/*' } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const ct = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, ct };
}

function isCss(u, ct) { return /\.css(\?|$)/i.test(u) || /text\/css/i.test(ct || ''); }

function enqueue(u) {
  if (!u) return;
  let abs;
  try { abs = new URL(u, ROOT_URL).href; } catch { return; }
  const proto = new URL(abs).protocol;
  if (proto !== 'http:' && proto !== 'https:') return;
  const key = abs.split('#')[0];
  if (seen.has(key)) return;
  seen.add(key);
  queue.push(key);
}

function extractFromCss(cssText, baseUrl) {
  const urls = [];
  // url(...)
  for (const m of cssText.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) {
    const raw = m[2].trim();
    if (raw.startsWith('data:')) continue;
    try { urls.push(new URL(raw, baseUrl).href); } catch {}
  }
  // @import "..."
  for (const m of cssText.matchAll(/@import\s+(?:url\()?\s*(['"])([^'"]+)\1/gi)) {
    try { urls.push(new URL(m[2], baseUrl).href); } catch {}
  }
  return urls;
}

// Rewrite url() and @import inside CSS to root-relative local refs.
function rewriteCss(cssText) {
  cssText = cssText.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (full, q, raw) => {
    if (raw.startsWith('data:')) return full;
    return 'url(' + q + raw + q + ')'; // keep as-is; relative urls resolve via preserved dir structure
  });
  // Absolute same-host urls -> root relative
  cssText = cssText.replaceAll('https://' + HOST, '');
  cssText = cssText.replaceAll('http://' + HOST, '');
  return cssText;
}

async function saveFile(disk, buf) {
  await fs.mkdir(path.dirname(disk), { recursive: true });
  await fs.writeFile(disk, buf);
}

async function processAsset(u) {
  const { disk } = localFor(u);
  try {
    const { buf, ct } = await fetchBuf(u);
    if (isCss(u, ct)) {
      let css = buf.toString('utf8');
      for (const child of extractFromCss(css, u)) enqueue(child);
      css = rewriteCss(css);
      await saveFile(disk, Buffer.from(css, 'utf8'));
    } else {
      await saveFile(disk, buf);
    }
    downloaded++;
    if (downloaded % 20 === 0) console.log('  ...downloaded', downloaded, 'assets');
  } catch (e) {
    failed++;
    console.warn('  FAIL', u, '-', e.message);
  }
}

function extractFromHtml(html) {
  const urls = [];
  const add = (u) => { if (u) urls.push(u); };
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<img[^>]+data-src=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<source[^>]+srcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0]);
  }
  for (const m of html.matchAll(/srcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0]);
  }
  for (const m of html.matchAll(/<video[^>]+poster=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/style=["'][^"']*url\(([^)]+)\)/gi)) add(m[1].replace(/['"]/g,'').trim());
  for (const m of html.matchAll(/content=["'](https?:\/\/[^"']+\.(?:png|jpe?g|webp|gif|svg|ico))["']/gi)) add(m[1]);
  return urls;
}

function rewriteHtml(html) {
  html = html.replaceAll('https://' + HOST, '');
  html = html.replaceAll('http://' + HOST, '');
  // Google fonts + other external -> /_ext/...
  html = html.replace(/(https?:)\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)([^"')\s]*)/gi,
    (full, p, host, rest) => '/_ext/' + host + rest);
  return html;
}

async function main() {
  console.log('Fetching homepage:', ROOT_URL);
  const res = await fetch(ROOT_URL, { headers: { 'User-Agent': UA } });
  let html = Buffer.from(await res.arrayBuffer()).toString('utf8');
  await fs.mkdir(OUT, { recursive: true });

  // enqueue everything referenced by the HTML
  for (const u of extractFromHtml(html)) enqueue(u);
  // explicitly enqueue google fonts css (may be in a <link>)
  console.log('Assets queued from HTML:', queue.length);

  // process queue (with CSS recursion adding more) - batches of 6
  while (queue.length) {
    const batch = queue.splice(0, 6);
    await Promise.all(batch.map(processAsset));
  }

  // write rewritten homepage
  html = rewriteHtml(html);
  await saveFile(path.join(OUT, 'index.html'), Buffer.from(html, 'utf8'));

  console.log('\nDONE. downloaded=%d failed=%d total-seen=%d', downloaded, failed, seen.size);
}

main().catch(e => { console.error(e); process.exit(1); });
