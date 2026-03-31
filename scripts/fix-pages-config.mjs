import { readFileSync, writeFileSync } from 'fs';

const configPath = 'dist/server/wrangler.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));

// Pages provides the ASSETS binding automatically — defining it causes a build error.
// Keep only 'directory' so Pages knows where static assets are.
if (config.assets?.binding === 'ASSETS') {
  delete config.assets.binding;
}

// Tell Pages the output root is dist/ (one level up from dist/server/)
config.pages_build_output_dir = '..';

writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✓ dist/server/wrangler.json patched for Cloudflare Pages');
