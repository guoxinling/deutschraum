import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

// Catches root-relative asset and service-worker URLs that break project Pages.
const html = readFileSync('dist/index.html', 'utf8')
const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8'))
const registration = readFileSync('dist/registerSW.js', 'utf8')
const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1])
assert.ok(urls.length >= 3)
for (const url of urls) {
  assert.ok(url.startsWith('/deutschraum/'), `Asset outside project path: ${url}`)
  assert.ok(existsSync('dist/' + url.slice('/deutschraum/'.length)), `Missing asset: ${url}`)
}
assert.equal(manifest.start_url, '/deutschraum/')
assert.equal(manifest.scope, '/deutschraum/')
assert.match(registration, /\/deutschraum\/sw\.js/)
console.log('Pages asset paths, manifest and service worker verified.')
