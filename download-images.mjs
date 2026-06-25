#!/usr/bin/env node
/**
 * ============================================================
 * VERTEX CONSULT — Image Downloader (Node.js)
 * Run:  node download-images.mjs
 * Works on Windows / Mac / Linux with Node.js 18+ installed.
 * ============================================================
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

mkdirSync(new URL('./assets/images/', import.meta.url), { recursive: true });

const IMAGES = {
  'hero.jpg':      'https://images.pexels.com/photos/35142390/pexels-photo-35142390.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000',
  'about.jpg':     'https://images.pexels.com/photos/18273251/pexels-photo-18273251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800',
  'ceo.jpg':       'https://images.pexels.com/photos/29995605/pexels-photo-29995605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  'project-1.jpg': 'https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-2.jpg': 'https://images.pexels.com/photos/33719016/pexels-photo-33719016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  'project-3.jpg': 'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-4.jpg': 'https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-5.jpg': 'https://images.pexels.com/photos/18506889/pexels-photo-18506889.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  'project-6.jpg': 'https://images.pexels.com/photos/7546611/pexels-photo-7546611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-7.jpg': 'https://images.pexels.com/photos/12836765/pexels-photo-12836765.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-8.jpg': 'https://images.pexels.com/photos/33719770/pexels-photo-33719770.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  'project-9.jpg': 'https://images.pexels.com/photos/8092431/pexels-photo-8092431.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  'project-10.jpg':'https://images.pexels.com/photos/36713682/pexels-photo-36713682.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-11.jpg':'https://images.pexels.com/photos/7722168/pexels-photo-7722168.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-12.jpg':'https://images.pexels.com/photos/8141957/pexels-photo-8141957.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-13.jpg':'https://images.pexels.com/photos/16473129/pexels-photo-16473129.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-14.jpg':'https://images.pexels.com/photos/14989324/pexels-photo-14989324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900',
  'project-15.jpg':'https://images.pexels.com/photos/37149144/pexels-photo-37149144.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
  'project-16.jpg':'https://images.pexels.com/photos/19980868/pexels-photo-19980868.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900'
};

const entries = Object.entries(IMAGES);
let ok = 0, fail = 0;

console.log('\n=========================================');
console.log(' Vertex Consult — Downloading images');
console.log('=========================================\n');

for (const [i, [name, url]] of entries.entries()) {
  const dest = new URL(`./assets/images/${name}`, import.meta.url);
  process.stdout.write(`  [${i + 1}/${entries.length}] ${name.padEnd(16)} ... `);

  if (existsSync(dest)) { console.log('already exists, skipped'); ok++; continue; }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Vertex-ImageDownloader/1.0' },
      signal: AbortSignal.timeout(45000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buffer);
    console.log(`OK  (${(buffer.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.log(`FAILED (${err.message})`);
    fail++;
  }
}

console.log('\n=========================================');
console.log(fail === 0
  ? ` ✓ All ${entries.length} images ready.`
  : ` ! ${fail} failed of ${entries.length}. Re-run to retry.`);
console.log('=========================================\n');
