// src/bot/flows/outros.js
const { clearSession } = require('../session');
const { saveRequest } = require('../../database/db');

async function handleOutros(client, from, body, message, session) {
  const resumo =
    `✅ *Mensagem Recebida!*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📝 *Outros Assuntos*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `💬 *Mensagem:* ${body}\n` +
    `📅 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `⏳ Sua mensagem foi encaminhada à equipe.\n` +
    `Em breve entraremos em contato.\n\n` +
    `_Envie *menu* para voltar ao início._`;

  await client.sendText(from, resumo);

  saveRequest({
    tipo: 'outros',
    telefone: from,
    mensagem: body,
  });

  clearSession(from);
}

module.exports = { handleOutros };
