const venom = require('venom-bot');
const { handleMessage } = require('./src/bot/handler');
const { initDB } = require('./src/database/db');

initDB();

venom.create({
  session: 'auto-atendimento-frota',
  multidevice: true,
  headless: true,
  logQR: true,
  browserArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu',
  ],
  autoClose: 0,
  createPathFileToken: true,
}).then((client) => {
  console.log('✅ Bot iniciado com sucesso!');
  client.onMessage((message) => handleMessage(client, message));
}).catch((err) => {
  console.error('❌ Erro ao iniciar bot:', err);
});
