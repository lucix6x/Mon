// src/bot/flows/desbloqueio.js
const { setSession, clearSession } = require('../session');
const { saveRequest } = require('../../database/db');
const { menuPrincipal } = require('../menus');

async function handleDesbloqueio(client, from, body, message, session) {
  switch (session.step) {
    case 1:
      setSession(from, { step: 2, matricula: body });
      await client.sendText(from, '✅ Matrícula recebida!\n\nAgora informe a *Placa* do veículo:');
      break;

    case 2:
      setSession(from, { step: 3, placa: body });
      await client.sendText(from, '✅ Placa recebida!\n\nInforme o *Motivo do Desbloqueio*:');
      break;

    case 3:
      setSession(from, { motivo: body });
      const s = { ...session, motivo: body };

      const resumo =
        `✅ *Solicitação de Desbloqueio Registrada!*\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `🔓 *Desbloqueio de Veículo*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 *Matrícula:* ${s.matricula}\n` +
        `🚗 *Placa:* ${s.placa}\n` +
        `📝 *Motivo:* ${body}\n` +
        `📅 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `⏳ Sua solicitação foi enviada à equipe responsável.\n` +
        `Aguarde o retorno em breve.\n\n` +
        `_Envie *menu* para voltar ao início._`;

      await client.sendText(from, resumo);

      saveRequest({
        tipo: 'desbloqueio',
        telefone: from,
        matricula: s.matricula,
        placa: s.placa,
        motivo: body,
      });

      clearSession(from);
      break;
  }
}

module.exports = { handleDesbloqueio };
