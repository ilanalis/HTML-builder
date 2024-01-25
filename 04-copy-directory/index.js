const path = require('path');
const fs = require('fs');

async function copyDirectory() {
  const initFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.access(copyFolderPath);
    await fs.promises.rm(copyFolderPath, { recursive: true }, (err) => {
      console.log('he');
      if (err) throw err;
    });
    copyDirectory();
  } catch (error) {
    fs.mkdir(copyFolderPath, (err) => {
      if (err) throw err;
      fs.readdir(initFolderPath, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          const initFilePath = path.join(initFolderPath, file);
          const copyFilePath = path.join(copyFolderPath, file);
          fs.copyFile(initFilePath, copyFilePath, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  }
}
copyDirectory();
