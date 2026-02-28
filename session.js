// src/bot/session.js
const sessions = {};

function getSession(from) {
  if (!sessions[from]) sessions[from] = {};
  return sessions[from];
}

function setSession(from, data) {
  sessions[from] = { ...sessions[from], ...data };
}

function clearSession(from) {
  sessions[from] = {};
}

module.exports = { getSession, setSession, clearSession };
