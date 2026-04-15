import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes("from './Modal.module.scss'")) {
      const isPagesFeature = filePath.includes('pages/Applications') || filePath.includes('pages\\Applications') || filePath.includes('pages/Emails') || filePath.includes('pages\\Emails');
      if (isPagesFeature) {
         content = content.replace(/from '\.\/Modal\.module\.scss'/g, "from '../../components/Modal.module.scss'");
         changed = true;
      }
      
      const isCommon = filePath.includes('components/common') || filePath.includes('components\\common');
      if (isCommon) {
         content = content.replace(/from '\.\/Modal\.module\.scss'/g, "from '../Modal.module.scss'");
         changed = true;
      }
    }
    
    // Also ApplicationDetailsModal bug
    if (content.includes("from '../../components/common/Modal.module.scss'")) {
       content = content.replace(/from '\.\.\/\.\.\/components\/common\/Modal\.module\.scss'/g, "from '../../components/Modal.module.scss'");
       changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed Modal SCSS in: ' + filePath);
    }
  }
});
console.log('Done.');
