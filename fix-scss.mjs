import fs from 'fs';
import path from 'path';

const srcDir = './src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.scss')) {
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix imports that are broken by being moved down one matching directory level.
    // e.g. @use '../styles/variables' -> @use '../../styles/variables'
    // But ONLY if the file was moved to pages/* or layouts/* or components/common/*
    const componentsMovedOneLevelDeeper = [
        'pages/Applications/',
        'pages/Emails/',
        'pages/Overview/',
        'pages/Landing/',
        'pages/Login/',
        'pages/LoginSuccess/',
        'layouts/Dashboard/',
        'components/common/'
    ];

    if (componentsMovedOneLevelDeeper.some(p => normalizedFilePath.includes(p))) {
        if (content.includes("@use '../styles/")) {
            content = content.replace(/@use '\.\.\/styles\//g, "@use '../../styles/");
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
console.log('SCSS paths fixed.');
