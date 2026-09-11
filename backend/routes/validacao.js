const express = require('express');
const router = express.Router();
const { lerLeads, salvarLeads } = require('./leads');

const codigosGerados = {};

router.post('/enviar-codigo', (req, res) => {
  const { celular, cnpj } = req.body;
  if (!celular) {
    return res.status(400).json({ erro: 'Número de celular é obrigatório' });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  codigosGerados[celular] = codigo;
  console.log(`Código gerado para ${celular}: ${codigo}`);

  const leads = lerLeads();
  leads.push({
    telefone: celular,
    cnpj: cnpj || '',
    data: new Date().toISOString(),
    status: 'aguardando validação',
  });
  salvarLeads(leads);

  res.json({ sucesso: true, mensagem: 'Código enviado por SMS' });
});

router.post('/verificar-codigo', (req, res) => {
  const { celular, codigo } = req.body;
  const codigoCorreto = codigosGerados[celular];

  if (codigo === codigoCorreto) {
    delete codigosGerados[celular];

    const leads = lerLeads();
    const ultimoLead = [...leads].reverse().find((l) => l.telefone === celular);
    if (ultimoLead) ultimoLead.status = 'validado';
    salvarLeads(leads);

    return res.json({ sucesso: true, mensagem: 'Número validado com sucesso' });
  }

  res.status(400).json({ sucesso: false, mensagem: 'Código inválido' });
});

module.exports = router;