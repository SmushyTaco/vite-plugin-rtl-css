import { defineConfig } from 'vite';
import viteTscPlugin from 'vite-plugin-tsc-transpile';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        'src/index.ts'
      ),
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.mjs` : `${entryName}.cjs`
    },
    rollupOptions: {
      external: ['vite', 'postcss', 'rtlcss']
    },
    sourcemap: true,
    minify: false
  },
  plugins: [
    viteTscPlugin(),
    dts({
      async afterBuild(emittedFiles) {
        for (const [filePath, content] of emittedFiles) {
          if (filePath.endsWith('.d.ts')) {
            const dMtsPath = filePath.replace(/\.d\.ts$/, '.d.mts');
            const dCtsPath = filePath.replace(/\.d\.ts$/, '.d.cts');
            await fs.writeFile(dMtsPath, content, 'utf8');
            await fs.writeFile(dCtsPath, content, 'utf8');
            await fs.unlink(filePath);
          }
        }
      }
    })
  ]
});
