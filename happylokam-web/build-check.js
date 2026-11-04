const { exec } = require('child_process');
const fs = require('fs');

exec('npm run build', { cwd: 'b:\\happylokamcoding\\frontend\\happylokam-web' }, (error, stdout, stderr) => {
  fs.writeFileSync('b:\\happylokamcoding\\frontend\\happylokam-web\\build-output.txt', stdout + '\n\n' + stderr + '\n\nError: ' + (error ? error.message : 'None'));
  console.log('Build check complete');
});
