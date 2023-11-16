const esbuildConfig = () => require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  platform: "node",
  format: "cjs"
});

esbuildConfig();
