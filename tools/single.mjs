// Writes dread-depths.html: the whole game in one file (the bundle inlined),
// for opening a downloaded copy directly in a browser.
import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('dist/game.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const tag = '<script src="dist/game.js"></script>';
if (!html.includes(tag)) throw new Error('script tag not found in index.html');
const out = html.replace('<link rel="manifest" href="manifest.webmanifest" />\n', '').replace(tag, () => `<script>\n${js}\n</script>`);
fs.writeFileSync('dread-depths.html', out);
console.log(`dread-depths.html ${(out.length / 1024).toFixed(0)} KB`);
