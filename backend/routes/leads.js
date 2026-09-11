const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const caminhoLeads = path.join(__dirname, '..', 'data', 'leads.json');

// tokens de sessão válidos (simples, em memória — reseta quando o servidor reinicia)
const tokensValidos = new Set();

function lerLeads() {
  const conteudo = fs.readFileSync(caminhoLeads, 'utf-8');
  return JSON.parse(conteudo);
}

function salvarLeads(leads) {
  fs.writeFileSync(caminhoLeads, JSON.stringify(leads, null, 2));
}

router.post('/login', (req, res) => {
  const { senha } = req.body;
  if (senha === process.env.ADMIN_SENHA) {
    const token = Math.random().toString(36).slice(2) + Date.now();
    tokensValidos.add(token);
    return res.json({ sucesso: true, token });
  }
  res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta' });
});

function exigirLogin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && tokensValidos.has(token)) {
    return next();
  }
  res.status(401).json({ sucesso: false, mensagem: 'Não autorizado' });
}

router.get('/listar', exigirLogin, (req, res) => {
  const leads = lerLeads();
  res.json({ sucesso: true, leads: leads.slice().reverse() });
});

module.exports = { router, lerLeads, salvarLeads };