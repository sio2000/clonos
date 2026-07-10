// Full-site static mirror of thepoumaacademy.com (WordPress + Enfold).
// Seeds pages from the Yoast sitemap, crawls internal links, downloads every
// page + all assets (recursing CSS url()/@import), rewrites URLs to root-relative.
import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://thepoumaacademy.com';
const HOST = 'thepoumaacademy.com';
const OUT = path.resolve('C:/Users/theoharis/Desktop/pouma-clone/site');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const SUBSITEMAPS = ['post-sitemap.xml','page-sitemap.xml','featured_post-sitemap.xml',
  'wpm-testimonial-sitemap.xml','category-sitemap.xml','post_tag-sitemap.xml'];

const pageSeen = new Set();
const pageQueue = [];
const assetSeen = new Set();
const assetQueue = [];
let pagesDone = 0, assetsDone = 0, assetsFail = 0;

const SKIP_RE = /(\/wp-admin\/|\/wp-json\/|xmlrpc\.php|\/feed\/?$|\/comments\/feed|wp-login|\?replytocom|#|\/wp-sitemap|sitemap\.xml|\.xml$)/i;
const ASSET_EXT_RE = /\.(css|js|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|otf|mp4|webm|ogg|mp3|pdf|zip|json|map)(\?|$)/i;

function abs(u, base = ORIGIN + '/') { try { return new URL(u, base).href; } catch { return null; } }

function diskForPage(u) {
  const url = new URL(u);
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';
  else if (!path.extname(p)) p += '/index.html';
  return path.join(OUT, p.replace(/^\//, ''));
}

function diskForAsset(u) {
  const url = new URL(u);
  let rel = url.host === HOST ? url.pathname : '/_ext/' + url.host + url.pathname;
  rel = decodeURIComponent(rel);
  if (rel.endsWith('/')) rel += 'index.html';
  return path.join(OUT, rel.replace(/^\//, ''));
}

function enqueuePage(u) {
  const a = abs(u); if (!a) return;
  const url = new URL(a);
  if (url.host !== HOST) return;
  if (SKIP_RE.test(a)) return;
  if (ASSET_EXT_RE.test(url.pathname)) return; // it's a file, not a page
  const key = (url.pathname).replace(/#.*$/, '');
  if (pageSeen.has(key)) return;
  pageSeen.add(key);
  pageQueue.push(ORIGIN + url.pathname + url.search);
}

function enqueueAsset(u, base) {
  const a = abs(u, base); if (!a) return;
  const proto = new URL(a).protocol;
  if (proto !== 'http:' && proto !== 'https:') return;
  const key = a.split('#')[0];
  if (assetSeen.has(key)) return;
  assetSeen.add(key);
  assetQueue.push(key);
}

async function fetchBuf(u) {
  const res = await fetch(u, { headers: { 'User-Agent': UA, 'Accept': '*/*' } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return { buf: Buffer.from(await res.arrayBuffer()), ct: res.headers.get('content-type') || '' };
}

function extractAssetsFromHtml(html) {
  const urls = [];
  const add = (u) => u && urls.push(u);
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<img[^>]+(?:data-)?src=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/srcset=["']([^"']+)["']/gi)) for (const p of m[1].split(',')) add(p.trim().split(/\s+/)[0]);
  for (const m of html.matchAll(/<video[^>]+poster=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<source[^>]+src=["']([^"']+)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/style=["'][^"']*url\(([^)]+)\)/gi)) add(m[1].replace(/['"]/g,'').trim());
  for (const m of html.matchAll(/content=["'](https?:\/\/[^"']+\.(?:png|jpe?g|webp|gif|svg|ico))["']/gi)) add(m[1]);
  return urls;
}

function extractLinksFromHtml(html) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
}

function extractCssRefs(css, base) {
  const out = [];
  for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) { const r=m[2].trim(); if(!r.startsWith('data:')){const a=abs(r,base); if(a)out.push(a);} }
  for (const m of css.matchAll(/@import\s+(?:url\()?\s*(['"])([^'"]+)\1/gi)) { const a=abs(m[2],base); if(a)out.push(a); }
  return out;
}

function rewriteHtml(html) {
  html = html.split('https://'+HOST).join('').split('http://'+HOST).join('');
  html = html.split('https://thepoumaacademy.disolt.eu').join('').split('http://thepoumaacademy.disolt.eu').join('');
  html = html.replace(/(https?:)?\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)([^"')\s]*)/gi, (f,p,h,rest)=>'/_ext/'+h+rest);
  return html;
}
function rewriteCss(css) {
  return css.split('https://'+HOST).join('').split('http://'+HOST).join('')
    .replace(/https?:\/\/fonts\.gstatic\.com/g, '/_ext/fonts.gstatic.com');
}

async function save(disk, buf) { await fs.mkdir(path.dirname(disk), { recursive: true }); await fs.writeFile(disk, buf); }

async function processAsset(u) {
  const disk = diskForAsset(u);
  const isCss = /\.css(\?|$)/i.test(u);
  if (existsSync(disk) && !isCss) { assetsDone++; return; } // already have it
  try {
    const { buf, ct } = await fetchBuf(u);
    if (isCss || /text\/css/i.test(ct)) {
      let css = buf.toString('utf8');
      for (const c of extractCssRefs(css, u)) enqueueAsset(c);
      await save(disk, Buffer.from(rewriteCss(css), 'utf8'));
    } else {
      await save(disk, buf);
    }
    assetsDone++;
    if (assetsDone % 40 === 0) console.log('  assets:', assetsDone);
  } catch (e) { assetsFail++; if(assetsFail<40) console.warn('  ASSET FAIL', u.replace(ORIGIN,''), e.message); }
}

async function processPage(u) {
  try {
    const res = await fetch(u, { headers: { 'User-Agent': UA } });
    if (!res.ok) { console.warn('  PAGE', res.status, u.replace(ORIGIN,'')); return; }
    let html = Buffer.from(await res.arrayBuffer()).toString('utf8');
    for (const a of extractAssetsFromHtml(html)) enqueueAsset(a, u);
    for (const l of extractLinksFromHtml(html)) enqueuePage(l);
    await save(diskForPage(u), Buffer.from(rewriteHtml(html), 'utf8'));
    pagesDone++;
    console.log('  page[%d] %s', pagesDone, decodeURIComponent(u.replace(ORIGIN,'')) || '/');
  } catch (e) { console.warn('  PAGE ERR', u.replace(ORIGIN,''), e.message); }
}

async function drain(queue, worker, conc) {
  while (queue.length) { const batch = queue.splice(0, conc); await Promise.all(batch.map(worker)); }
}

async function main() {
  // seed pages from sitemaps
  enqueuePage(ORIGIN + '/');
  for (const s of SUBSITEMAPS) {
    try { const t = await (await fetch(ORIGIN + '/' + s, { headers:{'User-Agent':UA} })).text();
      for (const m of t.matchAll(/<loc>([^<]+)<\/loc>/g)) if (!m[1].endsWith('.xml')) enqueuePage(m[1]);
    } catch {}
  }
  console.log('Seeded pages:', pageQueue.length);
  // crawl pages (discovers more links + collects assets)
  await drain(pageQueue, processPage, 5);
  console.log('\nPages done: %d. Assets queued: %d. Downloading assets...', pagesDone, assetQueue.length);
  await drain(assetQueue, processAsset, 6);
  console.log('\n==== DONE ====');
  console.log('pages=%d assets=%d assetFail=%d', pagesDone, assetsDone, assetsFail);
}
main().catch(e => { console.error(e); process.exit(1); });
