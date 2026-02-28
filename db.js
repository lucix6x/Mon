// src/database/db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../data/solicitacoes.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS solicitacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      telefone TEXT,
      matricula TEXT,
      placa TEXT,
      motivo TEXT,
      localizacao TEXT,
      destino TEXT,
      foto TEXT,
      rodas_travadas TEXT,
      mensagem TEXT,
      status TEXT DEFAULT 'pendente',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Banco de dados inicializado.');
}

function saveRequest(data) {
  const stmt = db.prepare(`
    INSERT INTO solicitacoes (tipo, telefone, matricula, placa, motivo, localizacao, destino, foto, rodas_travadas, mensagem)
    VALUES (@tipo, @telefone, @matricula, @placa, @motivo, @localizacao, @destino, @foto, @rodas_travadas, @mensagem)
  `);
  stmt.run({
    tipo: data.tipo || null,
    telefone: data.telefone || null,
    matricula: data.matricula || null,
    placa: data.placa || null,
    motivo: data.motivo || null,
    localizacao: data.localizacao || null,
    destino: data.destino || null,
    foto: data.foto || null,
    rodas_travadas: data.rodas_travadas || null,
    mensagem: data.mensagem || null,
  });
}

function getAllRequests() {
  return db.prepare('SELECT * FROM solicitacoes ORDER BY criado_em DESC').all();
}

module.exports = { initDB, saveRequest, getAllRequests };
