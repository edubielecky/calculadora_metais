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

console.log('1. Compilando o projeto React oficial em formato IIFE autônomo...');

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
        name: 'CalculadoraMetaisApp'
      }
    }
  }
});

let jsContent = '';
let cssContent = '';

result.output.forEach(item => {
  if (item.type === 'chunk') {
    jsContent += item.code + '\n';
  } else if (item.type === 'asset' && item.fileName.endsWith('.css')) {
    cssContent += item.source + '\n';
  }
});

console.log('2. Mapeando e convertendo todas as imagens e assets para Base64 Data URIs...');
const imageMap = new Map();

const imageDirectories = [
  path.join(rootDir, 'src', 'assets'),
  path.join(rootDir, 'public')
];

imageDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico'].includes(ext)) {
        const filePath = path.join(dir, file);
        const fileData = fs.readFileSync(filePath);
        const mimeType = ext === '.svg' ? 'image/svg+xml' : `image/${ext.replace('.', '')}`;
        const base64Uri = `data:${mimeType};base64,${fileData.toString('base64')}`;

        imageMap.set(file, base64Uri);
        imageMap.set(`/assets/${file}`, base64Uri);
        imageMap.set(`assets/${file}`, base64Uri);
        imageMap.set(`/${file}`, base64Uri);
      }
    });
  }
});

// Substituir qualquer referência de imagem no JS e CSS por Base64 Data URIs
imageMap.forEach((base64Uri, relativePath) => {
  const regex = new RegExp(relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  jsContent = jsContent.replace(regex, base64Uri);
  cssContent = cssContent.replace(regex, base64Uri);
});

// Favicon em Base64
const iconBase64 = imageMap.get('/softcomp_logo.png') || imageMap.get('softcomp_logo.png') || '';

console.log('3. Gerando o arquivo HTML único sem dependências de módulos ES...');
const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora de Peso Teórico de Metais | SOFTCOMP ERP</title>
  <link rel="icon" type="image/png" href="${iconBase64}" />
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- Bundle JS IIFE Autônomo para execução via duplo-clique (file://) sem erros de CORS -->
  <script>
${jsContent}
  </script>
</body>
</html>
`;

const outputPath = path.join(standaloneDir, 'index.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`\n🎉 SUCESSO! O arquivo standalone 100% idêntico e funcional via duplo clique (file://) foi gerado em:\n${outputPath}\n`);
