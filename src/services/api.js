const API_URL = process.env.REACT_APP_API_URL || '';

export async function enviarCodigo(telefone, cnpj) {
  const res = await fetch(`${API_URL}/api/validacao/enviar-codigo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ celular: telefone, cnpj }),
  });
  return res.json();
}

export async function verificarCodigo(telefone, codigo) {
  const res = await fetch(`${API_URL}/api/validacao/verificar-codigo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ celular: telefone, codigo }),
  });
  return res.json();
}

export async function loginAdmin(senha) {
  const res = await fetch(`${API_URL}/api/leads/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha }),
  });
  return res.json();
}

export async function listarLeads(token) {
  const res = await fetch(`${API_URL}/api/leads/listar`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}