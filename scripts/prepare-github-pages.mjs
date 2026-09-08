import { access, cp } from 'node:fs/promises';
import { join } from 'node:path';

const outputRoot = join(process.cwd(), 'dist', 'client');
const repositoryName = 'uk-trip-dashboard-2026';
const generatedAssets = join(outputRoot, repositoryName, '_next');
const publishedAssets = join(outputRoot, '_next');

await access(generatedAssets);
await cp(generatedAssets, publishedAssets, { recursive: true, force: true });

console.log('GitHub Pages assets prepared at dist/client/_next');
