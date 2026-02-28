// src/bot/menus.js
function menuPrincipal() {
  return (
    `🚗 *Auto Atendimento - Gestão de Frotas* 🚗\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Olá! Selecione uma das opções abaixo:\n\n` +
    `*1️⃣* 🔓 Desbloqueio de Veículo\n` +
    `*2️⃣* ⛽ Liberação de Restrição de Abastecimento\n` +
    `*3️⃣* 🆘 Solicitação de Guincho\n` +
    `*4️⃣* 📝 Outros\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Digite o número da opção desejada._\n` +
    `_A qualquer momento, envie *menu* para voltar ao início._`
  );
}

module.exports = { menuPrincipal };
