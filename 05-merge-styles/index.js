const path = require('path');
const fs = require('fs');

async function createBundleCss() {
  const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
  fs.unlink(bundleFilePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      throw err;
    }
  });
  const projectStylesFolderPath = path.join(__dirname, 'styles');
  const files = await fs.promises.readdir(projectStylesFolderPath, {
    withFileTypes: true,
  });
  const writeStream = fs.createWriteStream(bundleFilePath, { flags: 'a' });
  await Promise.all(
    files.map(async (file) => {
      await appendFile(file, writeStream, projectStylesFolderPath);
    }),
  );
  writeStream.end();
}
async function appendFile(file, writeStream, projectStylesFolderPath) {
  const filePath = path.join(projectStylesFolderPath, file.name);
  const fileExt = path.extname(filePath);
  if (file.isFile() && fileExt === '.css') {
    const readableStream = fs.createReadStream(filePath, 'utf-8');
    return new Promise((resolve) => {
      readableStream.pipe(writeStream, { end: false });
      readableStream.on('end', resolve);
    });
  }
}
createBundleCss();
