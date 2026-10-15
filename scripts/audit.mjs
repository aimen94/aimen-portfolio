import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadData(path) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { exports });
  return exports;
}
const { defaultContent: content } = loadData('data/default-content.ts');
const { expertise } = loadData('data/expertise.ts');
const { serializeJsonLd } = loadData('lib/seo.ts');
function keys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, entry]) => {
    const path = `${prefix}.${key}`;
    if (entry && typeof entry === 'object') return keys(entry, path);
    assert.equal(typeof entry, 'string', path);
    assert.ok(entry.trim(), `Empty translation: ${path}`);
    return [path];
  });
}
assert.deepEqual(keys(content.locales.ar).sort(), keys(content.locales.en).sort());
// An Arabic language-switch label is intentional in the English edition.
function checkEnglish(value, path = '') {
  for (const [key, entry] of Object.entries(value)) {
    if (entry && typeof entry === 'object') checkEnglish(entry, `${path}.${key}`);
    else if (key !== 'arabic') assert.ok(!/\p{Script=Arabic}/u.test(entry), `Arabic in English copy: ${path}.${key}`);
  }
}
checkEnglish(content.locales.en);
for (const project of content.projects) {
  assert.deepEqual(keys(project.highlights.ar), keys(project.highlights.en));
  for (const field of ['name', 'category', 'status', 'short', 'description']) {
    for (const locale of ['ar', 'en']) assert.ok(project[field][locale].trim());
  }
  for (const image of project.images) {
    assert.ok(fs.existsSync(`public${image.src}`), `Missing image: ${image.src}`);
    for (const locale of ['ar', 'en']) assert.ok(image.label[locale] && image.description[locale]);
  }
}
for (const item of expertise) {
  for (const locale of ['en', 'ar']) {
    assert.ok(item.title[locale] && item.description[locale] && item.intro[locale]);
    assert.ok(item.sections.length >= 4);
    for (const section of item.sections) assert.ok(section.title[locale] && section.body[locale]);
  }
  for (const id of item.projectIds) assert.ok(content.projects.some(project => project.id === id));
}
assert.ok(!serializeJsonLd({ text: '</script><script>alert(1)</script>' }).includes('<'));
console.log('PASS: translation keys, nonempty text, English language consistency, project media, safe JSON-LD.');

const base = process.argv[2];
if (base) {
  const paths = ['ar', 'en'].flatMap(locale => [`/${locale}`, ...content.projects.map(p => `/${locale}/projects/${p.id}`), ...expertise.map(p => `/${locale}/expertise/${p.slug}`)]);
  const documents = new Map();
  const titles = new Set(); const descriptions = new Set();
  for (const path of paths) {
    // No JavaScript execution: confirms crawlable content and metadata in server HTML.
    const response = await fetch(`${base}${path}`, { headers: { 'user-agent': 'Googlebot' } });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    documents.set(path, html);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    assert.ok(title && description, path); assert.ok(!titles.has(title), `Duplicate title: ${path}`); assert.ok(!descriptions.has(description), `Duplicate description: ${path}`);
    titles.add(title); descriptions.add(description);
    assert.ok(html.includes(`href="https://aimen.ly${path}"`), path);
    for (const locale of ['en', 'ar', 'x-default']) assert.ok(html.includes(`hrefLang="${locale}"`), `${path}: ${locale}`);
    assert.ok(html.includes(path.startsWith('/ar') ? 'dir="rtl"' : 'dir="ltr"'));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
    assert.ok(schemas.length, path);
    if (path.split('/').length === 2) {
      assert.ok(schemas.some(item => item['@type'] === 'ProfilePage' && item.mainEntity['@id'].endsWith('/#person')));
      const h1 = html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1];
      assert.ok(h1?.includes(path.startsWith('/ar') ? 'مهندس برمجيات' : 'Software Engineer'), `${path}: professional H1`);
    } else {
      assert.ok(schemas.some(item => item['@type'] === 'BreadcrumbList' && item.itemListElement.length === 2));
    }
    for (const schema of schemas) {
      assert.equal(schema['@context'], 'https://schema.org');
      assert.ok(!['LocalBusiness', 'AggregateRating'].includes(schema['@type']));
    }
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length);
  assert.ok(!sitemap.includes('<lastmod>'));
  for (const path of paths) assert.ok(sitemap.includes(`https://aimen.ly${path}`));
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.ok(robots.includes('Disallow: /admin')); assert.ok(robots.includes('https://aimen.ly/sitemap.xml'));
  for (const path of ['/fr', '/ar/projects/missing', '/en/projects/missing', '/en/expertise/missing', '/ar/expertise/missing', '/en/missing', '/ar/missing']) assert.equal((await fetch(`${base}${path}`)).status, 404, path);
  for (const [path, target] of [['/', '/en'], ['/projects/salahly', '/en/projects/salahly']]) {
    const r = await fetch(`${base}${path}`, { redirect: 'manual' });
    assert.equal(r.status, 308); assert.equal(r.headers.get('location'), target);
  }
  const admin = await (await fetch(`${base}/admin`)).text(); assert.ok(admin.includes('noindex'));
  // Check HTML links and fragment destinations without executing JavaScript.
  let linkCount = 0;
  for (const [path, html] of documents) {
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      const url = new URL(href, `${base}${path}`);
      if (![new URL(base).origin, `https://${content.settings.domain}`].includes(url.origin)) continue;
      const target = documents.get(url.pathname);
      assert.ok(target, `Undiscoverable/broken internal link: ${path} → ${href}`);
      if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Broken fragment: ${path} → ${href}`);
      linkCount++;
    }
  }
  // Check ordinary browsers too: no streamed soft 404s.
  for (const path of ['/en/projects/missing', '/ar/expertise/missing']) {
    const r = await fetch(`${base}${path}`, { headers: { 'user-agent': 'Mozilla/5.0 Chrome/130.0' } });
    assert.equal(r.status, 404, `${path}: browser status`);
    assert.ok((await r.text()).includes('noindex'));
  }
  console.log(`PASS: ${paths.length} SSR pages, unique metadata, parsed schema, sitemap, robots, true 404s, permanent redirects, admin noindex; ${linkCount} internal links/fragments.`);
}
