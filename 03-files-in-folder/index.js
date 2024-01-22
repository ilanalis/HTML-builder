const fs = require('node:fs/promises');
const path = require('path');

const pathName = path.join(__dirname, 'secret-folder');

fs.readdir(pathName, { withFileTypes: true }).then(async (files) => {
  for (const file of files) {
    if (file.isFile()) {
      const fileName = file.name.split('.')[0];
      const fileExt = path
        .extname(path.join(__dirname, 'secret-folder', file.name))
        .replace('.', '');
      const filePath = path.join(pathName, file.name);
      try {
        const stats = await fs.stat(filePath);
        const size = stats.size;
        console.log(`${fileName} - ${fileExt} - ${size}b`);
      } catch (err) {
        console.log(err);
      }
    }
  }
});
