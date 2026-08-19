const esbuild = require('esbuild');
const fs = require('fs');

const entryPoints = fs
  .readdirSync('src', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .reduce((acc, { name }) => {
    acc[`${name}/index`] = `src/${name}/index.ts`;
    return acc;
  }, {});

esbuild
  .build({
    entryPoints,
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'node24',
    platform: 'node',
    external: ['@aws-sdk/*'],
    outdir: '.build',
  })
  .catch(() => process.exit(1));
