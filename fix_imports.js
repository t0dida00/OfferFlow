const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
}

const srcDir = path.resolve('src');
const files = getFiles(srcDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let fixedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Regex to match imports with version numbers
    // matches: from "package_name@1.2.3" or from '@scope/pkg@1.2.3'
    // Captures the package name in group 1
    const regex = /from\s+["'](@?[^"']+)@\d[^"']*["']/g;

    if (regex.test(content)) {
        const newContent = content.replace(regex, (match, pkgName) => {
            return `from "${pkgName}"`;
        });
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Fixed: ${path.basename(file)}`);
        fixedCount++;
    }
});

console.log(`Total files fixed: ${fixedCount}`);
