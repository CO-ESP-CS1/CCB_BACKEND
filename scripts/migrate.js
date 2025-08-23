const { exec } = require('child_process');

exec('npx prisma migrate deploy', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing migration: ${error}`);
    return;
  }
  console.log(`Migration stdout: ${stdout}`);
  console.error(`Migration stderr: ${stderr}`);
});