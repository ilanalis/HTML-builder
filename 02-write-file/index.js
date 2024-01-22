const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const pathName = path.join(__dirname, 'text.txt');

stdout.write('what is your favorite dish?\n');

fs.access(pathName, fs.constants.F_OK, (err) => {
  if (!err) {
    fs.unlink(pathName, (err) => {
      if (err) throw err;
    });
  }
});

fs.writeFile(pathName, '', (err) => {
  if (err) throw err;
});

function farewellFunction() {
  stdout.write('\nwow this is really tasty bro\n');
  process.exit();
}

stdin.on('data', (data) => {
  fs.appendFile(pathName, data, (err) => {
    if (err) throw err;
  });
  process.on('SIGINT', () => {
    farewellFunction();
  });
  if (data.toString().trim() === 'exit') {
    farewellFunction();
  }
});
