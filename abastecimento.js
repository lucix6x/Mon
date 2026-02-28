// src/bot/flows/abastecimento.js
const { setSession, clearSession } = require('../session');
const { saveRequest } = require('../../database/db');
const path = require('path');
const fs = require('fs');

async function handleAbastecimento(client, from, body, message, session) {
  switch (session.step) {
    case 1:
      setSession(from, { step: 2, placa: body });
      await client.sendText(from, '✅ Placa recebida!\n\nInforme a *Matrícula* do condutor:');
      break;

    case 2:
      setSession(from, { step: 3, matricula: body });
      await client.sendText(
        from,
        '✅ Matrícula recebida!\n\n' +
        '📸 Agora envie a *foto do painel* do veículo mostrando:\n' +
        '• KM atual\n' +
        '• Nível do combustível\n\n' +
        '_Envie a foto como imagem._'
      );
      break;

    case 3:
      if (message.type !== 'image') {
        await client.sendText(from, '⚠️ Por favor, envie uma *imagem* do painel do veículo.');
        return;
      }

      let fotoPath = null;
      try {
        const buffer = await client.decryptFile(message);
        const fileName = `painel_${from}_${Date.now()}.jpg`;
        fotoPath = path.join(__dirname, '../../../uploads', fileName);
        fs.mkdirSync(path.dirname(fotoPath), { recursive: true });
        fs.writeFileSync(fotoPath, buffer);
      } catch (e) {
        console.error('Erro ao salvar foto:', e);
      }

      const s = session;
      const resumo =
        `✅ *Solicitação de Liberação Registrada!*\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `⛽ *Liberação de Restrição de Abastecimento*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `🚗 *Placa:* ${s.placa}\n` +
        `📋 *Matrícula:* ${s.matricula}\n` +
        `📸 *Foto do painel:* Recebida ✅\n` +
        `📅 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `⏳ Solicitação enviada à equipe de frotas.\n` +
        `Aguarde o retorno em breve.\n\n` +
        `_Envie *menu* para voltar ao início._`;

      await client.sendText(from, resumo);

      saveRequest({
        tipo: 'abastecimento',
        telefone: from,
        placa: s.placa,
        matricula: s.matricula,
        foto: fotoPath,
      });

      clearSession(from);
      break;
  }
}

module.exports = { handleAbastecimento };
