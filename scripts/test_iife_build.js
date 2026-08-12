import { build } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, 'standalone');

if (!fs.existsSync(standaloneDir)) {
  fs.mkdirSync(standaloneDir, { recursive: true });
}

console.log('Building IIFE bundle with Vite...');

const result = await build({
  configFile: false,
  root: rootDir,
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    write: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.join(rootDir, 'index.html'),
      output: {
        format: 'iife',
        name: 'CalculadoraMetaisApp',
        inlineDynamicImports: true
      }
    }
  }
});

console.log('Build completed. Output chunks count:', result.output ? result.output.length : 0);
