const path = require('path');
const fs = require('fs');

async function copyDirectory() {
  const initFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');
  if (fs.existsSync(copyFolderPath)) {
    fs.readdir(copyFolderPath, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        fs.unlink(path.join(copyFolderPath, file), (err) => {
          if (err) throw err;
        });
      });
      fs.rmdir(copyFolderPath, (err) => {
        if (err) throw err;
        copyDirectory();
      });
    });
  } else {
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
