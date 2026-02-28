// src/bot/handler.js
const { getSession, setSession, clearSession } = require('./session');
const { menuPrincipal } = require('./menus');
const { handleDesbloqueio } = require('./flows/desbloqueio');
const { handleAbastecimento } = require('./flows/abastecimento');
const { handleGuincho } = require('./flows/guincho');
const { handleOutros } = require('./flows/outros');
const { saveRequest } = require('../database/db');

async function handleMessage(client, message) {
  if (message.isGroupMsg || message.type === 'revoked') return;

  const from = message.from;
  const body = message.body?.trim();
  const session = getSession(from);

  // Mensagem inicial ou palavra-chave de reinício
  if (!session.flow || body?.toLowerCase() === 'menu' || body === '0') {
    await client.sendText(from, menuPrincipal());
    setSession(from, { flow: 'menu' });
    return;
  }

  // Seleção do menu principal
  if (session.flow === 'menu') {
    switch (body) {
      case '1':
        setSession(from, { flow: 'desbloqueio', step: 1 });
        await client.sendText(from, '🔓 *Desbloqueio de Veículo*\n\nPor favor, informe sua *Matrícula*:');
        break;
      case '2':
        setSession(from, { flow: 'abastecimento', step: 1 });
        await client.sendText(from, '⛽ *Liberação de Restrição de Abastecimento*\n\nPor favor, informe a *Placa* do veículo:');
        break;
      case '3':
        setSession(from, { flow: 'guincho', step: 1 });
        await client.sendText(from, '🚗 *Solicitação de Guincho*\n\nPor favor, informe a *Placa* do veículo:');
        break;
      case '4':
        setSession(from, { flow: 'outros', step: 1 });
        await client.sendText(from, '📝 *Outros Assuntos*\n\nDescreva sua solicitação ou dúvida:');
        break;
      default:
        await client.sendText(from, '⚠️ Opção inválida. Por favor, escolha uma opção de *1 a 4*:\n\n' + menuPrincipal());
    }
    return;
  }

  // Roteamento dos fluxos
  switch (session.flow) {
    case 'desbloqueio':
      await handleDesbloqueio(client, from, body, message, session);
      break;
    case 'abastecimento':
      await handleAbastecimento(client, from, body, message, session);
      break;
    case 'guincho':
      await handleGuincho(client, from, body, message, session);
      break;
    case 'outros':
      await handleOutros(client, from, body, message, session);
      break;
  }
}

module.exports = { handleMessage };
