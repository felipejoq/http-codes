/**
 * Generates a clean, minimal wrangler.json for Cloudflare Pages deployment.
 *
 * The adapter merges internal wrangler fields (triggers, kv_namespaces without IDs,
 * images binding, etc.) into the generated config, making it invalid for Pages.
 * This script replaces it with only the fields Pages actually needs.
 */
import { readFileSync, writeFileSync } from 'fs';

const generatedPath = 'dist/server/wrangler.json';
const generated = JSON.parse(readFileSync(generatedPath, 'utf8'));

const pagesConfig = {
  name: generated.name || 'httpecho',
  main: generated.main || 'entry.mjs',
  compatibility_date: generated.compatibility_date,
  compatibility_flags: generated.compatibility_flags,
  // Tell Pages the output root is dist/ (one level up from dist/server/)
  pages_build_output_dir: '..',
  // Static assets live in dist/client/ — Pages provides ASSETS binding automatically
  assets: {
    directory: '../client',
  },
  vars: generated.vars || {},
};

writeFileSync(generatedPath, JSON.stringify(pagesConfig, null, 2));
console.log('✓ dist/server/wrangler.json replaced with clean Pages config');
