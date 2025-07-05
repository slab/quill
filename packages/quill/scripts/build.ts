import { build } from 'vite';
import { resolve, join } from 'path';
import esmConfig from '../vite.config.esm.js';
import umdConfigs from '../vite.config.umd.js';
const __dirname = import.meta.dirname || new URL('.', import.meta.url).pathname;
import fs from 'fs';
import c from 'chalk';

const configs = [...umdConfigs, esmConfig];
const filesToCopy = ['package.json', 'README.md', 'LICENSE'];

const dist = resolve(__dirname, '../dist');
const l = console.log;

async function buildAll() {
  const dists = [];

  for (const [i, config] of configs.entries()) {
    await build({
      ...config,
      build: {
        ...config.build,
        outDir: `${dist}/${i}`,
      },
    });

    dists.push(`${dist}/${i}`);
  }

  return dists;
}

function mergeDirs(source: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = join(source, item);
    const destPath = join(dest, item);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      mergeDirs(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// clean up the dist directory if it exists
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}

buildAll()
  .then((dists) => {
    l('\n');
    l(c.green('Build completed successfully. Merging directories...'));

    const dest = dist;

    for (const source of dists) {
      mergeDirs(source, dest);
      fs.rmSync(source, { recursive: true, force: true });
    }

    l(
      c.blue('Directories merged successfully. Build output is in:'),
      c.underline(dest),
    );

    // Copy additional files to the dist directory
    for (const file of filesToCopy) {
      const sourcePath = resolve(__dirname, `../${file}`);
      fs.copyFileSync(sourcePath, join(dest, file));

      l(c.yellow(`Copied ${file} to dist directory.`));
    }

    l(c.green('All files copied successfully. Build is ready! 🎉'));
  })
  .catch((error) => {
    l(c.red('Build failed:', error));
    process.exit(1);
  });
