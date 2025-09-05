const fs = require('fs');
const path = require('path');

async function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? rmDir(full) : fs.promises.unlink(full);
  }));
  await fs.promises.rmdir(dir);
}

async function copyDir(src, dest) {
  if (!fs.existsSync(src)) throw new Error(`Source not found: ${src}`);
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const link = await fs.promises.readlink(srcPath);
      await fs.promises.symlink(link, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const src = path.join(repoRoot, 'shared');
    const dest = path.join(repoRoot, 'server', 'shared');
    // remove existing dest then copy
    if (fs.existsSync(dest)) {
      await rmDir(dest);
    }
    await copyDir(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
    process.exit(0);
  } catch (err) {
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
