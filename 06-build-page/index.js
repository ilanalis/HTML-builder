const fs = require('fs');
const path = require('path');

async function buildPage() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  try {
    await fs.promises.access(projectDistPath);
    await removeFolder(projectDistPath);
    buildPage();
  } catch (error) {
    fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
      if (err) throw err;
    });
    const initAssetsFolderPath = path.join(__dirname, 'assets');
    const copyAssetsFolderPath = path.join(__dirname, 'project-dist', 'assets');
    copyDirectory(initAssetsFolderPath, copyAssetsFolderPath);
    createBundleCss();
    createHTML();
  }
}

async function removeFolder(folderPath) {
  await fs.promises.rm(folderPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function createBundleCss() {
  const bundleFilePath = path.join(__dirname, 'project-dist', 'style.css');
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

async function copyDirectory(source, dest) {
  fs.mkdir(dest, (err) => {
    if (err) throw err;
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        if (file.isFile()) {
          const initFilePath = path.join(source, file.name);
          const copyFilePath = path.join(dest, file.name);
          fs.copyFile(initFilePath, copyFilePath, (err) => {
            if (err) throw err;
          });
        } else {
          copyDirectory(
            path.join(source, file.name.toString()),
            path.join(dest, file.name.toString()),
          );
        }
      });
    });
  });
}

async function createHTML() {
  const templatePath = path.join(__dirname, 'template.html');
  const distHTMLPath = path.join(__dirname, 'project-dist', 'index.html');
  const regex = /{{\s*(\w+)\s*}}/g;
  await fs.promises.writeFile(distHTMLPath, '', (err) => {
    if (err) throw err;
  });
  let templateContent = await fs.promises.readFile(templatePath, 'utf-8');
  const templateTags = templateContent.match(regex);
  for (const templateTag of templateTags) {
    templateContent = await replaceTag(templateTag, templateContent);
  }
  await fs.promises.appendFile(distHTMLPath, templateContent, (err) => {
    if (err) throw err;
  });
}

async function replaceTag(tag, template) {
  const nameOfComponent = tag.replace('{{', '').replace('}}', '');
  const componentPath = path.join(
    __dirname,
    'components',
    `${nameOfComponent}.html`,
  );
  let componentContent = await fs.promises.readFile(componentPath, 'utf-8');
  template = template.replace(tag, componentContent);
  return template;
}
buildPage();
