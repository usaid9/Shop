import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const dirsToRemove = [
  path.join(projectRoot, '.vite'),
  path.join(projectRoot, 'dist'),
];

const filesToRemove = [
  path.join(projectRoot, '.vite.zip'),
];

console.log('[v0] Clearing Vite cache...');

dirsToRemove.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`[v0] Removed directory: ${dir}`);
  }
});

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`[v0] Removed file: ${file}`);
  }
});

console.log('[v0] Cache cleared successfully! Dev server will re-optimize on next start.');
