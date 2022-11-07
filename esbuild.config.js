const esbuildConfig = () => require('esbuild').buildSync({
  entryPoints: ['src/index.ts','src/utils/code-util.ts'],
  outdir: 'dist',
  platform: "node",
  format: "cjs"
});

esbuildConfig();
