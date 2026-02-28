// src/bot/flows/guincho.js
const { setSession, clearSession } = require('../session');
const { saveRequest } = require('../../database/db');
const path = require('path');
const fs = require('fs');

async function handleGuincho(client, from, body, message, session) {
  switch (session.step) {
    case 1:
      setSession(from, { step: 2, placa: body });
      await client.sendText(from, '✅ Placa recebida!\n\nInforme sua *Matrícula*:');
      break;

    case 2:
      setSession(from, { step: 3, matricula: body });
      await client.sendText(
        from,
        '✅ Matrícula recebida!\n\n' +
        '📍 Informe sua *Localização Atual*:\n' +
        '_Você pode enviar sua localização pelo WhatsApp ou digitar o endereço completo._'
      );
      break;

    case 3:
      let localizacao = body;
      if (message.type === 'location') {
        localizacao = `https://maps.google.com/?q=${message.lat},${message.lng}`;
      }
      setSession(from, { step: 4, localizacao });
      await client.sendText(from, '✅ Localização recebida!\n\nInforme o *Destino* (local de entrega do veículo):');
      break;

    case 4:
      setSession(from, { step: 5, destino: body });
      await client.sendText(
        from,
        '✅ Destino registrado!\n\n' +
        '📸 Envie a *foto do veículo completo* (deve mostrar a carroceria completa, se houver).\n\n' +
        '_Envie a imagem como foto._'
      );
      break;

    case 5:
      if (message.type !== 'image') {
        await client.sendText(from, '⚠️ Por favor, envie uma *imagem* do veículo completo.');
        return;
      }

      let fotoPath = null;
      try {
        const buffer = await client.decryptFile(message);
        const fileName = `guincho_${from}_${Date.now()}.jpg`;
        fotoPath = path.join(__dirname, '../../../uploads', fileName);
        fs.mkdirSync(path.dirname(fotoPath), { recursive: true });
        fs.writeFileSync(fotoPath, buffer);
      } catch (e) {
        console.error('Erro ao salvar foto guincho:', e);
      }

      setSession(from, { step: 6, foto: fotoPath });
      await client.sendText(
        from,
        '✅ Foto recebida!\n\n' +
        '🔒 *As rodas do veículo estão travadas?*\n\n' +
        '*1️⃣* Sim\n' +
        '*2️⃣* Não'
      );
      break;

    case 6:
      if (body !== '1' && body !== '2') {
        await client.sendText(from, '⚠️ Responda *1* para Sim ou *2* para Não sobre as rodas travadas.');
        return;
      }

      const rodasTravadas = body === '1' ? 'Sim' : 'Não';
      const s = session;

      const resumo =
        `✅ *Solicitação de Guincho Registrada!*\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `🆘 *Solicitação de Guincho*\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `🚗 *Placa:* ${s.placa}\n` +
        `📋 *Matrícula:* ${s.matricula}\n` +
        `📍 *Localização:* ${s.localizacao}\n` +
        `🏁 *Destino:* ${s.destino}\n` +
        `📸 *Foto do veículo:* Recebida ✅\n` +
        `🔒 *Rodas travadas:* ${rodasTravadas}\n` +
        `📅 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `⏳ Sua solicitação foi enviada à equipe.\n` +
        `Um atendente entrará em contato em breve.\n\n` +
        `_Envie *menu* para voltar ao início._`;

      await client.sendText(from, resumo);

      saveRequest({
        tipo: 'guincho',
        telefone: from,
        placa: s.placa,
        matricula: s.matricula,
        localizacao: s.localizacao,
        destino: s.destino,
        foto: s.foto,
        rodas_travadas: rodasTravadas,
      });

      clearSession(from);
      break;
  }
}

module.exports = { handleGuincho };
