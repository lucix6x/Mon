// index.js - Inicialização do Bot
const venom = require('venom-bot');
const { handleMessage } = require('./src/bot/handler');
const { initDB } = require('./src/database/db');

initDB();

venom.create({
  session: 'auto-atendimento-frota',
  multidevice: true,
  headless: true,
  logQR: true,
}).then((client) => {
  console.log('✅ Bot iniciado com sucesso!');
  client.onMessage((message) => handleMessage(client, message));
}).catch((err) => {
  console.error('❌ Erro ao iniciar bot:', err);
});